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
				text: `Added playlist [**__${playlist.name}__**](${playlist.url}) to the queue.`,
				fields: {
					'Playlist Duration': { 
						content: `\`${playlist.formattedDuration}\``,	
						inline: true 
					},
					'Playlist Length': {
						content: `${playlist.songs.length} tracks`,
						inline: true
					},
					'Requested by': { 
						content: playlist.user.tag,
						inline: true 
					}
				},
				footer: {
					text: `Thanks for using ${Bot.user.username}!`,
					icon: Bot.user.avatarURL()
				}
			}));
		} catch(error) {
			super.log('AddList@sendMessage', error);
		}
	}
}