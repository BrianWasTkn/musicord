const { Collection, Constants } = require('discord.js');
const { AkairoHandler } = require('discord-akairo');
const { Events } = Constants;

class Spawner extends AkairoHandler {
	constructor(client, options, config, spawn) {
		super(client, options);

		/**
		 * The Queue
		 * @type {Collection}
		*/
		this.queue = new Collection();

		/**
		 * The Spawn Info
		 * @type {Object}
		*/
		this.spawn = spawn;

		/**
		 * The Spawn Configuration
		 * @type {Object}
		*/
		this.config = config;

		this.client.incrementMaxListeners();
		this.client.on(Events.MESSAGE_CREATE, this.spawn);
		this.client.on(Events.GUILD_MEMBER_REMOVE, this.handleLeave);

		this.once('end', () => {
			this.client.removeListener(Events.MESSAGE_CREATE);
			this.client.removeListener(Events.GUILD_MEMBER_REMOVE);
			this.decrementMaxListeners();
		});
	}

	checkSpawn(channel) {
		const { categories, blChannels } = this.client.config.spawn;
		const { odds } = this.config;

		if (this.queue.has(channel.id)) return false;
		if (Math.random() * odds < 100 - odds) return false;
		if (!categories.includes(channel.parentID)) return false;
		if (blChannels.includes(channel.id)) return false;
		return true;
	}

	async spawn(message) {
		const { queue, config, spawn } = this;
		const { channel } = message;
		const { odds } = config;
		if (!(this.checkSpawn())) return;
		
		const ratelimit = config.cooldown || client.config.spawns.rateLimit;
		queue.set(channel.id, spawn.title);
		this.client.setTimeout(() => {
			return queue.delete(channel.id);
		}, rateLimit * 1000 * 60);

		const event = await this.spawnMessage(channel);
		const results = await this.collectMessages(event);
		await channel.send(results);
		this.emit('end');
	}

	async spawnMessage(channel) {
		const { emoji, type, title, description } = this.spawn;
		const event = await channel.send(`**${emoji} \`${type}\` EVENT WOO HOO!\`**\n**${title}**\n${description}`);
		return event;
	}

	async collectMessages(event) {
		const { strings, emoji, title } = this.spawn;
		const { entries, timeout } = this.config;
		const answered = new Collection();

		const filter = m => {
			return m.content.toLowerCase() === this.client.util.random('arr', strings).toLowerCase()
			&& !answered.has(m.author.id);
		}, collector = await event.channel.createMessageCollector(filter, {
			max: entries, time: timeout
		});

		collector.on('collect', async msg => {
			if (collector.collected.first().id === msg.id) {
				await msg.channel.send(`\`${msg.author.username}\` got it first!`);
			} else {
				await msg.react(emoji);
			}
		});

		collector.on('end', async collected => {
			await event.edit([
				event.content + '\n',
				`**<:memerRed:729863510716317776> ` + `\`This event has expired.\`**`,
			].join('\n'));

			if (!collected.size) {
				return '**<:memerRed:729863510716317776> No one got the event.**';
			}

			const { min, max } = config.rewards;
			const coinObj = { min: min / 1000, max: max / 1000 };
			const coins = this.client.util.random('num', coinObj) * 1000;
			const verbs = ['obtained', 'grabbed', 'magiked', 'won', 'procured'];
			const verb = this.client.util.random('arr', verbs);
			const promises = [], results = [];
			
			collector.array().forEach(m => {
				results.push(`\`${m.author.username}\` ${verb} **${coins.toLocaleString()}** coins`);
				promises.push(m.author.send([
					`**${emoji} Congratulations!**`,
					`You ${verb} **${coins.toLocaleString()}** coins from the "${title}" event.`,
					`Please gather **5 payouts** first and claim it in our payouts channel.`
				].join('\n')).catch(() => {}));
			});

			await Promise.all(promises);
			collector.channel.guild.channels.cache
			.get('791659327148261406').send({ embed: {
				author: { name: `Results for '${title}' event` },
				description: results.join('\n'),
				color: 'RANDOM',
				footer: { text: `From: ${collector.channel.name}` }
			}}).catch(() => {});

			return { embed: {
				author: { name: `Results for '${spawn.title}' event` },
				description: results.join('\n'),
				color: 'GOLD',
				footer: { text: `Check your direct messages.` }
			}};
		});
	}
}

module.exports = Spawner;