import Command from '../classes/Command.js'

export default class Volume extends Command {
	constructor(client) {
		super(client, {
			name: 'volume',
			aliases: ['v'],
			description: 'Adjust the volume of the player in this guild.',
			usage: '<1-100>',
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

		/* Args */
		let [rate] = args;
		rate = parseInt(rate)
		if (!isNaN(rate)) {
			/* More than 100 */
			if (rate > 100) {
				try {
					return msg.channel.send(super.createEmbed({
						title: 'Too Loud',
						color: 'RED',
						text: 'You cannot set the volume higher than **100%** to avoid earrapes.'
					}));
				} catch(error) {
					super.log('volume@msg', error);
				}
			} 
			/* Less than 1 */
			else if (rate < 1) {
				try {
					return msg.channel.send(super.createEmbed({
						title: 'Too Low',
						color: 'RED',
						text: 'You cannot set the volume lower than a percent.'
					}));
				} catch(error) {
					super.log('volume@msg', error);
				}
			}
			/* Else, do it */
			else {
				try {
					/* Queue */
					const queue = await Bot.player.setVolume(msg, parseInt(rate, 10));
					try {
						await msg.channel.send(super.createEmbed({
							title: 'Volume Changed',
							color: 'GREEN',
							title: `Successfully changed the volume to **${queue.volume}%**`,
							footer: {
								text: `Thanks for using ${Bot.user.username}!`,
								icon: Bot.user.avatarURL()
							}
						}));
					} catch(error) {
						super.log('volume@msg', error);
					}
				} catch(error) {
					super.log('volume', error);
				}
			}
		}

	}
}