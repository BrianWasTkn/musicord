import Command from '../../classes/Command'

export default class Pause extends Command {
	constructor(client) {
		super(client, {
			name: 'pause',
			aliases: ['freeze'],
			description: 'Temporarily stops the queue unless you resume it.',
			usage: 'command',
			cooldown: 5000
		}, {
			category: 'Music',
			user_permissions: [],
			client_permissions: ['EMBED_LINKS'],
			music_checks: ['voice', 'queue'],
			args_required: false
		});
	}

	async execute({ Bot, msg }) {
		try {
			/* Pause */
			await Bot.distube.pause(msg);
			try {
				/* Message */
				await msg.channel.send(super.createEmbed({
					title: 'Player Paused',
					color: 'GREEN',
					text: 'Successfully paused playing the songs.'
				}));
			} catch(error) {
				super.log('pause@msg', error);
			}
		} catch(error) {
			super.log('pause', error);
		}
	}
}