import Listener from '../../classes/Listener.js'

export default class AddList extends Listener {
	constructor(client) {
		super(client);
		/* Emit */
		client.distube.on('addSong', async (message, queue, playlist) => await this.run({
			Bot: message.client,
			msg: message,
			queue, playlist
		}));
	}

	async run({ Bot, msg, queue, playlist }) {
		try {
			/* Message */
			await msg.channel.send(super.createEmbed({
				title: 'Added to Queue',
				color: 'GREEN',
				text: `Added [**__${playlist.name}__**](${playlist.url}) with **${playlist.songs.length}** items to the queue.`,
				fields: {
					'Duration': { content: `\`${playlist.formattedDuration}\``,	inline: true },
					'Added by': { content: playlist.user.tag,									inline: true }
				},
				footer: {
					text: `Thanks for using ${Bot.user.username}!`,
					icon: Bot.user.avatarURL()
				}
			}));

			/* Player Controls */
			await this.client.utils.handleControls({
				msg, song: playlist.songs[0], msg, embed: m 
			});
		} catch(error) {
			super.log('AddList@sendMessage', error);
		}
	}
}