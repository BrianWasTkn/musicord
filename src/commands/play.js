import Command from '../classes/Command.js'

export default class Play extends Command {
	constructor(client) {
		super(client, {
			name: 'play',
			aliases: ['youtube'],
			description: 'Searches a track from supported sources and plays the first result.',
			usage: '<search query | source URL>',
			cooldown: 5000,
			rate_limit: 1
		}, {
			category: 'Music',
			user_permissions: ['CONNECT'],
			client_permissions: ['CONNECT', 'SPEAK'],
			music_checks: ['voice', 'queue'],
			args_required: true
		});
	}

	_args({ args, msg }) {
		try {
			return msg.channel.send(super.createEmbed({
				title: 'Missing Args',
				color: 'RED',
				text: 'You need something to play!'
			}));
		} catch(error) {
			super.log('play@_args_msg', error);
		}
	}

	async execute({ Bot, msg, args }) {
		/** Missing Args */
		if (args.length < 1) {
			try {
				return msg.channel.send(super.createEmbed({
					title: 'Missing Args',
					color: 'GREEN',
					text: 'You need a search query or a valid URL.'
				}));
			} catch(error) {
				super.log('play@msg', error);
			}
		}

		/* Join */
		const { channel } = msg.member.voice;
		/* Check if not in channel */
		if (!channel) {
			/* Join */
			const { voice } = await channel.join().catch(error => {
				super.log('play@join', error)
			});
			/* Self-deafen */
			await voice.setSelfDeaf(true).catch(error => {
				super.log('play@self_deaf', error);
			});
			try {
				/* Play */
				await Bot.distube.play(msg);
			} catch(error) {
				super.log('play@play', error);
			}
		}
	}
}