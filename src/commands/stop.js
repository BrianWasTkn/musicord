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
			/* Stop */
			const queue = await Bot.player.stop(msg);
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