import Command from '../classes/Command.js'

export default class Stop extends Command {
	constructor(client) {
		super(client, {
			name: 'stop',
			aliases: ['fuckoff'],
			description: 'Stops playing the song and clears the queue.',
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
			const queue = await Bot.player.stop(msg);
		} catch(error) {
			super.log('stop', error);
		}
	}
}