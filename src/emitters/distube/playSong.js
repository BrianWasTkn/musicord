import Listener from '../../classes/Listener.js'

export default class PlaySong extends Listener {
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
				title: 'Now Playing',
				color: 'BLUE',
				text: `Now Playing [**__${song.name}__**](${song.url}) on the queue.`,
				fields: {
					'Duration': { 	content: `\`${song.formattedDuration}\``, 	inline: true },
					'Requested by': { 	content: song.user.tag,									inline: true },
					'# of Plays': { content: song.views.toLocaleString(), 			inline: true }
				},
				footer: {
					text: `Thanks for using ${Bot.user.username}!`,
					icon: Bot.user.avatarURL()
				}
			}));
		} catch(error) {
			super.log('PlaySong@sendMessage', error);
		}
	}
}