const { Listener } = require('discord-akairo');
const { Collection } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');

const Spawner = require('../../lib/Spawner.js');

/**
 * Discord Message event
 * @exports @class @extends Listener
*/
module.exports = class Lava extends Listener {
	constructor() {
		super('spawner', {
			emitter: 'client',
			event: 'message'
		});
	}

	async exec(message) {
		const spawns = readdirSync(join(process.cwd(), 'src', 'spawns'));
		const spawn = require(join(process.cwd(), 'src', 'spawns', this.client.util.random('arr', spawns)));
		
		new Spawner(
			this.client, join(process.cwd(), 'src', 'spawns'), 
			spawn.config, spawn.visuals
		);
	}

	async createCollector({
		event, channel, queue, spawn, string
	}, {
		maxEntries, time, type
	}) {
		const entries = new Collection();
		const filter = m => !entries.has(m.author.id) && m.content.toLowerCase() === string;
		const collector = await channel.createMessageCollector(filter, { max: maxEntries, time });
		const { min, max } = spawn.rewards;

		collector.on('collect', async m => {
			if (collector.collected.first().id === m.id) {
				await m.channel.send(`\`${m.author.username}\` answered first!`);
			} else {
				await m.react(spawn.emoji);
			}
		});

		collector.on('end', async c => {
			await event.edit(`${event.content}\n\n**<:memerRed:729863510716317776> \`This event has expired.\`**`);
			if (!c.size) return collector.channel.send('**<:memerRed:729863510716317776> No one got the event.**');
			const coinObj = { min: min / 1000, max: max / 1000 };
			const coins = this.client.util.random('num', coinObj) * 1000;
			const verbs = ['obtained', 'grabbed', 'magiked', 'won', 'procured'];
			const verb = this.client.util.random('arr', verbs);

			const promises = [], results = [];
			c.array().forEach(m => {
				results.push(`\`${m.author.username}\` ${verb} **${coins.toLocaleString()}** coins`);
				promises.push(m.author.send([
					`**${spawn.emoji} Congratulations!**`,
					`You ${verb} **${coins.toLocaleString()}** coins from the "${spawn.title}" event.`,
					`Please gather **5 payouts** first and claim it in our payouts channel.`
				].join('\n')).catch(() => {}));
			});

			collector.channel.guild.channels.cache.get('791659327148261406').send({ embed: {
				author: { name: `Results for '${spawn.title}' event` },
				description: results.join('\n'),
				color: 'RANDOM',
				footer: { text: `From: ${channel.name}` }
			}}).catch(() => {});

			await Promise.all(promises);
			collector.channel.send({ embed: {
				author: { name: `Results for '${spawn.title}' event` },
				description: results.join('\n'),
				color: 'GOLD',
				footer: { text: `Check your direct messages.` }
			}}).catch(() => {});
		});
	}

	/**
	 * Executes this listener
	 * @method
	 * @param {Message} message the discord message
	 * @returns {Promise<void>}
	*/
	async execcc(message) {
		if (message.author.bot || message.channel.type === 'dm') return;
		const queue = this.client.lavaManager.spawnQueues;
		const { channel } = message;
		const spawn = this.pickRandom();
		const { 
			chances, rateLimit, time, max, rewards,
			emoji, eventType, title, description,
			strings, enabled, maxEntries
		} = spawn;

		// Scenarios
		if (!enabled) return;
		if (queue.has(channel.id)) return;
		if (!this.client.config.spawn.categories.includes(channel.parentID)) return;

		// RateLimiter
		queue.set(channel.id, title);
		this.client.setTimeout(() => {
			queue.delete(channel.id);
		}, (1000 * 60) * (rateLimit || this.client.config.spawn.rateLimit));
		if (Math.trunc(Math.random() * 100) < (100 - chances)) return;

		// Message
		const string = this.client.util.random('arr', strings);
		const event = await channel.send(`**${emoji} \`${eventType} EVENT TIME WEE WOO!\`**\n**${title}**\n${description}`);
		await channel.send(`Type \`${string.split('').join('\u200B')}\``);

		// Collectors
		// Types: `spam`, `multiple`, `once`
		await this.createCollector({
			event, channel, queue, spawn, string
		}, {
			maxEntries, time
		});
	}

	pickRandom() {
		const spawns = readdirSync(join(__dirname, '..', '..', 'spawns'));
		const spawn = require(join(__dirname, '..', '..', 'spawns', this.client.util.random('arr', spawns)));
		return spawn;
	}
}