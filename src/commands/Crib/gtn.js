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
				{ id: 'lock', type: 'boolean', default: false }
			]
		});
	}

	async lock(message, boolean) {
		return message.channel.updateOverwrite(message.guild.id, {
			SEND_MESSAGES: boolean
		}, `Guess Number by ${message.author.tag}`);
	}

	async exec(message, args) {
		const { amount, lock } = args; 
		const { channel } = message;

		if (!amount) {
			const m = await channel.send('You need an amount, bro.');
			await m.delete({ timeout: 5000 });
		}
	}
}