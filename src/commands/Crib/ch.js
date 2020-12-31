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

		const string = this.client.util.random('array', strings);
		await channel.send(`Type \`${string}\` to have a chance on splitting up \`${Number(amount).toLocaleString()}\` coins!`);
		const entries = new Collection();
		const collector = await channel.createMessageCollector(
			m => (m.content.toLowerCase() === string.toLowerCase()) && !entries.has(m.author.id), {
				max: Infinity, time: 60000
		});

		collector.on('collect', async m => {
				await m.react('memerGold:753138901169995797');
				entries.set(m.author.id, true);
		});

		collector.on('end', async collected => {
				this.client.util.crib.heists.delete(guild.id);
				if (!collected.size) return message.reply('Looks like you\'re alone.');
				else if (collected.size <= 1) return message.reply('I guess nobody wants to join this event, sadness.');

				await collector.channel.send(`\`${collected.size}\` people are teaming up to split **${amount.toLocaleString()}** coins.`);
				if (lock) this.lockChannel(message, false);
				let success = [];
				collected.array().sort(() => Math.random() - 0.5).forEach(c => {
					if (Math.random() > 0.66) success.push(c);
				});

				const coins = Math.floor(Number(amount) / success.length);
				success = success.length ? success.map(s => s.author.toString()).join('\n') : 'Everyone died LOL';
				const order = success.sort(() => Math.random() - 0.5).join(', ');
				await collector.channel.send(`Good job everybody, we got \`${coins.toLocaleString()}\` coins each!\n\n${success}`);
		});
	}
}
