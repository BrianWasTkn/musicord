import Command from '../../classes/Command'

export default class Play extends Command {
	constructor(client) {
		super(client, {
			name: 'play',
			aliases: ['youtube'],
			description: 'Searches a track from supported sources and plays the first result.',
			usage: '<query|URL>',
			cooldown: 5000
		}, {
			category: 'Music',
			user_permissions: ['CONNECT'],
			client_permissions: ['CONNECT', 'SPEAK'],
			music_checks: ['voice', 'queue'],
			args_required: true
		});
	}

	_argsMessage({ msg, args }) {
		return super.createEmbed({
			title: 'Missing Args',
			color: 'RED',
			text: 'You need something to play!'
		});
	}

	async execute({ Bot, msg, args }) {
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