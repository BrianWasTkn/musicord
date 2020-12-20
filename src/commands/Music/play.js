const { Command } = require('discord-akairo')

module.exports = class MusicPlay extends Command {
	constructor() {
		super('play', {
			aliases: ['play', 'p'],
			channel: 'guild',
			category: 'Music',
			typing: true,
			cooldown: 3000,
			clientPermissions: ['CONNECT', 'SPEAK'],
			args: [
				{ id: 'query', match: 'content' }
			]
		});
	}

	async exec(message, args) {
		const { query } = args;

		if (!query) {
			return message.reply(this.client.util.embed({
				title: 'Missing Arguments',
				color: 'RED',
				description: 'You need to play something to use this command.',
				footer: {
					text: this.client.user.username,
					iconURL: this.client.user.avatarURL()
				}
			}));
		}

		try {
			const { player } = this.client;
			await player.play(message, query)
		} catch(error) {
			await message.channel.send(error.message);
			this.client.util.log(this.constructor.name, 'error', `play`, error.stack);
		}
	}
}