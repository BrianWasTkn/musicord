import Listener from '../../classes/Listener.js'

export default class AddSong extends Listener {
	constructor(client) {
		super(client);
	}

	async run(message, queue, song) {
		try {
			await message.channel.send(super.createEmbed({
				title: 'Added to Queue',
				color: 'BLUE',
				text: `Added [**__${song.name}__**](${song.url}) to the queue.`,
				fields: {
					'Duration': { 	content: `\`${song.formattedDuration}\``, 	inline: true },
					'Added by': { 	content: song.user.tag, 										inline: true },
					'# of Plays': { content: song.views.toLocaleString(), 			inline: true }
				},
				footer: {
					text: `Thanks for using ${bot.user.username}!`,
					icon: bot.user.avatarURL()
				}
			}));
		} catch(error) {
			super.log('AddSong@sendMessage', error);
		}
	}
}