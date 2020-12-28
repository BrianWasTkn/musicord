const { Command } = require('discord-akairo');

module.exports = class Crib extends Command {
	constructor() {
		super('gtn', {
			aliases: ['gtn', 'gnum'],
			category: 'Crib',
			channel: 'guild',
			cooldown: 60000,
			rateLimit: 1,
			args: [
				{ id: 'amount', type: 'number' },
				{ id: 'min', type: 'number', default: 1 },
				{ id: 'max', type: 'number', default: 100 },
				{ id: 'lock', type: 'boolean', default: false }
				{ id: 'prize', type: 'string', default: '100K Coins' }
			]
		});
	}

	async lock(channel, boolean) {
		return channel.updateOverwrite(channel.guild.id, {
			SEND_MESSAGES: boolean
		});
	}

	async exec(message, args) {
		const { amount, min, max, lock, prize } = args; 
		const { channel, guild } = message;

		// No Amount
		if (!amount) {
			return channel.send('You need an amount, bro.').then(async m => {
				await m.delete({ timeout: 5000 });
			});
		}

		// Prepare
		const random = this.client.util.random('num', { 
			min: 1, max: Number(amount)});
		const gChannel = guild.channels.cache.get('695614620781641778');
		// const gChannel = guild.channels.cache.get('694697159848886343');
		await gChannel.send({ embed: {
			title: 'Guess the Number',
			color: 'ORANGE',
			description: [
				`Guess my random number between **${min}** and **${max}** within **60** seconds.`,
				`When the number has been guessed, I will automatically lock this channel to reveal the winner.`,
				`\nGoodluck!`
			].join('\n'),
			thumbnail: { url: guild.iconURL({ dynamic: true }) },
			footer: {
				text: this.client.user.username,
				iconURL: this.client.user.avatarURL()
			}
		}});

		const winner = await this.startCollecting(gChannel, amount, random, lock);
		if (lock) await this.lock(gChannel, true);
		await gChannel.send([
			`**Winner**`,
			`${winner.user.toString()} got the number **${random}**, congrats.`,
			`You won **${prize}** GG!`
		].join('\n'));
	}

	async startCollecting(gChannel, amount, random, lock) {
		const entries = new (require('discord.js')).Collection();
		const collector = await gChannel.createMessageCollector(message => {
			return Number(message.content);
		}, {
			max: Infinity, time: 60000
		});

		if (lock) await this.lock(gChannel, true);
		collector.on('collect', async m => {
			if (Number(m.content) === random) {
				collector.end();
			}
		});

		collector.on('end', async collected => {
			return collected;
		});
	}
}