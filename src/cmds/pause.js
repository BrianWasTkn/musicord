import Command from '../classes/Command.js'

class Leave extends Command {
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

	async execute({ msg }) {
		try {
			
		} catch(error) {
			super.log('leave', error);
		}
	}
}