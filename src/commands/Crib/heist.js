const { Command } = require('discord-akairo');
const { Collection } = require('discord.js');

const strings = [
	'JOIN EVENT', 'COINS WHEN', 'LOL',
	'MEMERS CRIB', 'E', 'DANK PLS', 
	'LEMME WIN BRUH', 'I WANNA BE A HELICOPTER'
];

module.exports = class Crib extends Command {
	constructor() {
		super('ch', {
			aliases: ['ch', 'customheist'],
			category: 'Crib',
			channel: 'guild',
			cooldown: 30000,
			rateLimit: 3,
			args: [
				{ id: 'amount', type: 'number' },
				{ id: 'lock', type: 'boolean',
					default: false }
			]
		});
	}

	async lockChannel(message, boolean) {
		return message.channel.updateOverwrite(message.guild.id, {
			SEND_MESSAGES: boolean
		}, `Custom Heist by ${message.author.tag}`);
	}

	async exec(message, args) {
		const { channel, guild } = message;
		const { amount, lock } = args;
		if (!amount) return message.reply('You need an amount.');
		else if (isNaN(amount)) return message.reply('Invalid amount.');

		if (this.client.util.crib.heists.has(guild.id)) {
			const pending = guild.channels.cache.get(this.client.util.crib.heists.get(guild.id));
			return message.reply(`There\'s currently an event happening in <#${pending.id}>.`);
		} else {
			this.client.util.crib.heists.set(guild.id, channel.id);
			if (lock) this.lockChannel(message, true);
		}

		const string = this.constructor.random('array', strings);
		await channel.send(`Type \`${string}\` to have a chance on splitting up \`${Number(amount).toLocaleString()}\` coins!`);
		const entries = new Collection();
		const collector = await channel.createMessageCollector(
			m => (m.content.toLowerCase() === string.toLowerCase()) && !entries.has(m.author.id), {
				max: Infinity, time: 60000
		});

		collector.on('collect', async m => {
				await m.react('✅');
				entries.set(m.author.id, true);
		});

		collector.on('end', async collected => {
				const m = collected.first();
				this.client.util.crib.heists.delete(guild.id);
				if (!collected.size) return message.reply('Looks like you\'re alone.');
				else if (collected.size <= 1) return message.reply('I guess nobody wants to join this event, sadness.');

				await m.channel.send(`\`${collected.size}\` people are teaming up to split **${Number(amount).toLocaleString()}** coins.`);
				let success = [], fail = [];
				collected.array().sort(() => Math.random() - 0.5).forEach(c => {
					if (Math.random() > 0.66) success.push(c);
					else fail.push(c);
				});

				const coins = Math.floor(Number(amount) / success.length);
				success = success.map(s => `+ ${s.author.username} got ${coins.toLocaleString()} coins`);
				fail = fail.map(f => `- ${f.author.username} died RIP`);
				const order = [success.join('\n'), fail.join('\n')].sort(() => Math.random() - 0.5).join('\n');
				await m.channel.send(order, { code: 'diff' });
				if (lock) this.lockChannel(message, false);
		});
	}

	static random(type, entries) {
		switch(type) {
			case 'array':
				return entries[Math.floor(Math.random() * entries.length)];
				break;
			case 'number': 
				const { max, min } = entries;
				return Math.floor(Math.random() * (max - min + 1) + min);
				break;
			default: 
				this.random('number', entries);
				break;
		}
	}
}
