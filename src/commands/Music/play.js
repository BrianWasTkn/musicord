const { Command } = require('discord-akairo')

module.exports = class MusicCommand extends Command {
	constructor() {
		super('play', {
			aliases: ['play', 'p'],
			channel: 'guild',
			category: 'Music',
			typing: true,
			cooldown: 3000,
			userPermissions: ['CONNECT'],
			clientPermissions: ['CONNECT', 'SPEAK'],
			args: [
				{ id: 'query', match: 'content' }
			]
		});
	}

	async exec(message, args) {
		const { query } = args,
			{ channel } = message;

		if (!query) {
			return await channel.send(this.client.util.embed({
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
			await player.play(message, query);
		} catch(error) {
			this.client.util.log(this.constructor.name, 'error', 'play', error.stack);
			return await channel.send(error.message);
		}
	}
}