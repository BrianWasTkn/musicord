import Command from '../classes/Command.js'

export default class Stop extends Command {
	constructor(client) {
		super(client, {
			name: 'stop',
			aliases: ['shut'],
			description: 'Stops playing the song and clears the queue.',
			usage: 'command',
			cooldown: 5000
		}, {
			category: 'Music',
			checks: ['voice', 'queue']
		});
	}

	async execute({ Bot, msg }) {
		try {
			/* Stop */
			await Bot.distube.stop(msg);
			try {
				/* Return a message */
				await msg.channel.send(super.createEmbed({
					title: 'Player Stopped',
					color: 'GREEN',
					text: 'The player has been stopped and the queue has been cleared.',
					footer: {
						text: `Thanks for using ${Bot.user.username}!`,
						icon: Bot.user.avatarURL()
					}
				}));
			} catch(error) {
				super.log('stop@msg', error);
			}
		} catch(error) {
			super.log('stop', error);
		}
	}
}