import Command from '../classes/Command.js'

export default class Queue extends Command {
	constructor(client) {
		super(client, {
			name: 'queue',
			aliases: ['tracks'],
			description: 'Sends an embed containing the current songs in the queue.',
			usage: 'command',
			cooldown: 5000
		}, {
			category: 'Music',
			checks: ['voice', 'queue']
		});
	}

	async execute({ Bot, msg }) {
		try {
			/* Queue with Mapped Songs */
			const songs = await Bot.distube.mapQueue(msg, true);
			try {
				/* Message */
				await msg.channel.send(super.createEmbed({
					title: 'Server Queue',
					color: 'BLUE',
					fields: {
						'Now Playing': { content: songs[0] },
						'Queue Songs': { content: songs[1] ? songs.slice(1).join('\n') : 'No more songs in queue.' }
					},
					footer: {
						text: `Thanks for using ${Bot.user.username}!`,
						icon: Bot.user.avatarURL()
					}
				}));
			} catch(error) {
				super.log('queue@msg', error);
			}
		} catch(error) {
			super.log('queue', error);
		}
	}
}