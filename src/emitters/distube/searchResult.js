import Listener from '../../classes/Listener.js'

export default class SearchResult extends Listener {
	constructor(client) {
		super(client);
		/* Emit */
		client.distube.on('searchResult', async (message, result) => await this.run({
			Bot: message.client,
			msg: message,
			result
		}));
	}

	async run({ Bot, msg, result }) {
		try {
			/* Map Results */
			result = result.map((song, index) => {
				return `**#${index + 1}: [__${song.name}__](${song.url}) - \`${song.formattedDuration}\``;
			});

			/* Message */
			await msg.channel.send(super.createEmbed({
				title: 'Search Results',
				color: 'GREEN',
				text: result.join('\n'),
				fields: {
					'Instructions': { content: 'Type the **# number** of your choice.', inline: true },
					'Expiration': { content: '30 seconds', inline: true }
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
			super.log('SearchResult@sendMessage', error);
		}
	}
}