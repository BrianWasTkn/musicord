import Listener from '../classes/Listener.js'

export default class PlaySong extends Listener {
	constructor(client) {
		super(client);
	}

	async run(message, queue, song) {
		try {
			await message.channel.send(super.createEmbed({
				title: 'Now Playing',
				color: 'BLUE',
				text: `Now Playing [**__${song.name}__**](${song.url}) on the queue.`,
				fields: {
					'Duration': { 	content: `\`${song.formattedDuration}\``, 	inline: true },
					'Requested by': { 	content: song.user.tag,									inline: true },
					'# of Plays': { content: song.views.toLocaleString(), 			inline: true }
				},
				footer: {
					text: `Thanks for using ${this.client.user.username}!`,
					icon: this.client.user.avatarURL()
				}
			}));
		} catch(error) {
			super.log('PlaySong@sendMessage', error);
		}
	}
}