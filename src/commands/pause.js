import Command from '../classes/Command.js'

export default class Pause extends Command {
	constructor(client) {
		super(client, {
			name: 'pause',
			aliases: ['freeze'],
			description: 'Temporarily stops the queue unless you resume it.',
			usage: 'command',
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
		this.checks = ['voice', 'queue', 'paused'];
	}

	async execute({ Bot, msg }) {
		try {
			const queue = await Bot.player.pause(msg);
			await msg.channel.send(super.createEmbed({
				title: 'Player Paused',
				color: 'GREEN',
				text: 'Successfully paused playing the songs.'
			}));
		} catch(error) {
			super.log('pause', error);
		}
	}
}