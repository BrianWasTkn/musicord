const { Collection, Constants } = require('discord.js');

class Spawner {
	constructor(client, config, spawn) {
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

		/**
		 * The Discord Client
		 * @type {Client}
		*/
		this.client = client;
	}

	checkSpawn(channel) {
		const { categories, blChannels } = this.client.config.spawn;

		if (this.queue.has(channel.id)) return false;
		if (!categories.includes(channel.parentID)) return false;
		if (blChannels.includes(channel.id)) return false;
		return true;
	}

	runCooldown(channel) {
		const rateLimit = this.config.cooldown || this.client.config.spawn.rateLimit;
		this.client.setTimeout(() => {
			this.queue.delete(channel.id);
		}, rateLimit * 60 * 1000);
	}

	async run(message) {
		const { queue, config, spawn } = this;
		const { channel } = message;
		const { odds } = config;
		if (!(this.checkSpawn(channel))) return;

		queue.set(channel.id, spawn.title);
		const event = await this.spawnMessage(channel);
		const results = await this.collectMessages(event);
		this.runCooldown(channel);
		return results;
	}

	async spawnMessage(channel) {
		const { emoji, type, title, description } = this.spawn;
		const event = await channel.send(`**${emoji} \`${type} EVENT WOO HOO!\`**\n**${title}**\n${description}`);
		return event;
	}

	async collectMessages(event) {
		return new Promise(async resolve => {
			const { entries, timeout, rewards } = this.config;
			const { strings, emoji, title } = this.spawn;
			const answered = new Collection();
			const string = this.client.util.random('arr', strings);

			await event.channel.send(`Type \`${string}\``);
			const filter = m => {
				return m.content.toLowerCase() === string.toLowerCase()
				&& !answered.has(m.author.id);
			}, collector = await event.channel.createMessageCollector(filter, {
				max: entries, time: timeout
			});

			collector.on('collect', async msg => {
				if (collector.collected.first().id === msg.id) {
					msg.channel.send(`\`${msg.author.username}\` got it first!`);
				} else {
					msg.react(emoji);
				}
			});

			collector.on('end', async collected => {
				await event.edit([
					event.content + '\n',
					`**<:memerRed:729863510716317776> ` + `\`This event has expired.\`**`,
				].join('\n'));

				if (!collected.size) {
					resolve({
						description: '**<:memerRed:729863510716317776> No one got the event.**',
						color: 'RED'
					});
				}

				const { min, max } = rewards;
				const coinObj = { min: min / 1000, max: max / 1000 };
				const coins = this.client.util.random('num', coinObj) * 1000;
				const verbs = ['obtained', 'grabbed', 'magiked', 'won', 'procured'];
				const verb = this.client.util.random('arr', verbs);
				const promises = [], results = [];

				collected.array().forEach(m => {
					results.push(`\`${m.author.username}\` ${verb} **${coins.toLocaleString()}** coins`);
					promises.push(m.author.send([
						`**${emoji} Congratulations!**`,
						`You ${verb} **${coins.toLocaleString()}** coins from the "${title}" event.`,
						`Please gather **5 payouts** first and claim it in our payouts channel.`
					].join('\n')).catch(() => {}));
				});

				await Promise.all(promises);
				collector.channel.guild.channels.cache.get('791659327148261406').send({ embed: {
					author: { name: `Results for '${title}' event` },
					description: results.join('\n'),
					color: 'RANDOM',
					footer: { text: `From: ${collector.channel.name}` }
				}}).catch(() => {});

				resolve({
					author: { name: `Results for '${title}' event` },
					description: results.join('\n'),
					color: 'GOLD',
					footer: { text: `Check your direct messages.` }
				});
			});
		});
	}
}

module.exports = Spawner;