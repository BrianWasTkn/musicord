import Command from '../classes/Command.js'

export default class Play extends Command {
	constructor(client) {
		super(client, {
			name: 'play',
			aliases: ['play'],
			description: 'Searches a track from supported sources and plays it.',
			usage: '<query | URL>',
			cooldown: 5000
		}, {
			category: 'Music',
			checks: ['voice', 'queue'],
		});
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

		/** Else, Do it */
		try {
			/* Play */
			await Bot.distube.play(msg);
		} catch(error) {
			super.log('play', error);
		}
	}
}