import Listener from '../../classes/Listener.js'

export default class AddSong extends Listener {
	constructor(client) {
		super(client);
		/* Emit */
		client.on('addSong', async (message, queue, song) => await this.run({
			Bot: message.client,
			msg: message,
			queue, song
		}));
	}

	async run({ Bot, msg, queue, song }) {
		try {
			await msg.channel.send(super.createEmbed({
				title: 'Added to Queue',
				color: 'GREEN',
				text: `Added [**__${song.name}__**](${song.url}) to the queue.`,
				fields: {
					'Duration': { 	content: `\`${song.formattedDuration}\``, 	inline: true },
					'Added by': { 	content: song.user.tag, 										inline: true },
					'# of Plays': { content: song.views.toLocaleString(), 			inline: true }
				},
				footer: {
					text: `Thanks for using ${Bot.user.username}!`,
					icon: Bot.user.avatarURL()
				}
			}));
		} catch(error) {
			super.log('AddSong@sendMessage', error);
		}
	}
}