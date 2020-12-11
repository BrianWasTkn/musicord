import Command from '../../lib/structures/Command'

export default class Volume extends Command {
	constructor(client) {
		super(client, {
			name: 'volume',
			aliases: ['set-volume'],
			description: 'Adjust the volume of the player in this guild.',
			usage: '<1-100>',
			cooldown: 5000
		}, {
			category: 'Music',
			user_permissions: [],
			client_permissions: ['EMBED_LINKS'],
			music_checks: ['voice', 'queue'],
			args_required: true
		});
	}

	_argsMessage({ msg, args }) {
		return super.createEmbed({
			title: 'Volume Rate',
			color: 'RED',
			text: 'You need a volume rate.'
		})
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
					const queue = await Bot.distube.setVolume(msg, parseInt(rate, 10));
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