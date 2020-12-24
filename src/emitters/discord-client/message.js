const { Listener } = require('discord-akairo');
const { Collection } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');

/**
 * Discord Message event
 * @exports @class @extends Listener
*/
module.exports = class DiscordListener extends Listener {
	constructor() {
		super('discord:message', {
			emitter: 'client',
			event: 'message'
		});
	}

	random(type, entry) {
		switch(type) {
			case 'arr': 
				return entry[Math.floor(Math.random() * entry.length)];
				break;
			case 'num':
				const { min, max } = entry;
				return Math.floor(Math.random() * (max - min + 1) + min);
				break;
			default:
				return this.random(Array.isArray(entry) ? 'arr' : 'num', entry);
				break;
		}
	}

	async handleMessageCollector(msg, channel, queue, spawn, options) {
		const entries = new Collection();
		const collector = await channel.createMessageCollector(
			m => (m.content.toLowerCase() === options.string.toLowerCase()) 
			&& !entries.has(m.author.id), {
			max: options.max, time: options.time
		});

		collector.on('collect', async m => {
			entries.set(m.author.id, true);
			if (collector.collected.first().id === m.id) {
				await m.channel.send(`\`${m.author.username}\` answered first!`);
			} else {
				// await m.react('✅');
				await m.react(spawn.config.emoji);
			}
		}).on('end', async collected => {
			await msg.edit([
				msg.content,
				'\n<:memerRed:729863510716317776> `This event has expired.`'
			].join('\n'));

			if (!collected.size) {
				queue.delete(channel.id);
				return channel.send(
					'**<:memerRed:729863510716317776> No one joined the event.**'
				);
			}

			const { rewards, title } = spawn.config;
			const results = [];

			collected.array().forEach(m => {
				let { min, max } = spawn.config.rewards;
				let coins = this.random('num', { 
					min: min / 1e3, max: max / 1e3 
				}) * 1000;
				results.push(`\`${m.author.username}\` grabbed **${coins.toLocaleString()}** coins`);
			});

			queue.delete(channel.id);
			await channel.send({ embed: {
				author: { name: `Results for '${spawn.config.title}' event` },
				description: results.join('\n'),
				color: 'GREEN',
				footer: { text: 'Claim these in our support channel.' }
			}});
		});
	}

	/**
	 * Executes this listener
	 * @method
	 * @param {Message} message the discord message
	 * @returns {Promise<void>}
	*/
	async exec(message) {
		if (message.author.bot || message.channel.type === 'dm') return;
		const { spawns } = this.client.config;
		const spawn = spawns[this.random('arr', Object.keys(spawns))];
		let {
			odds, time, max, type, rewards,
			emoji, eventType, title, description,
			strings
		} = spawn.config;
		const queue = this.client.lavaManager.spawnQueues;

		const cat = message.guild.channels.cache.get('691595121866571776');
		if (!cat.children.keyArray().includes(message.channel.id)) return;
		if (Math.round(Math.random() * 100) < (100 - odds)) return;
		if (queue.has(message.channel.id)) return;

		const string = this.random('arr', strings);
		const msg = await message.channel.send([
			`**${emoji} \`${eventType} EVENT ENCOUNTERED\`**`,
			`**${title}**`, description,
		].join('\n'));
		await message.channel.send([
			'Type', `\`\u200B${string}\u200B\``
		].join(' '));

		queue.set(message.channel.id, spawn.title);
		await this.handleMessageCollector(msg, message.channel, queue, spawn, {
			max, time, string
		});
	}
}