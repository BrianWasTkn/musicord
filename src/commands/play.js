import Command from '../classes/Command.js'

export default class Play extends Command {
	constructor(client) {
		super(client, {
			name: 'play',
			aliases: ['p'],
			description: 'Searches a track from supported sources and plays it.',
			usage: '<query | URL>',
			cooldown: 5000
		});

		/**
		 * Command Category 
		 * @type {String}
		 */
		this.category = 'Music';

		/**
		 * Custom Checking
		 * * `dj` - dj role
		 * * `voice` - if member in voice channel
		 * * `queue` - if queue is present
		 * * `paused` - if player paused
		 * * `stopped` - if player stopped
		 * @type {String[]}
		 */
		this.checks = ['voice', 'queue'];
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
			await Bot.player.play(msg);
			try {
				/* Message */
				await msg.channel.send(super.createEmbed({
					title: 'Player Paused',
					color: 'GREEN',
					text: 'Successfully paused playing the songs.'
				}));
			} catch(error) {
				super.log('play@msg', error);
			}
		} catch(error) {
			super.log('play', error);
		}
	}
}