const { Listener } = require('discord-akairo');

/**
 * Distube PlaySong event
 * @exports @class @extends Listener
*/
module.exports = class DistubeListener extends Listener {
	constructor() {
		super('distube:playSong', {
			emitter: 'distube',
			event: 'playSong'
		});
	}

	/**
	 * Executes this listener
	 * @method
	 * @param {Discord.Message} message TypeOf Discord.Message
	 * @param {Queue} queue The server queue
	 * @param {Song} song The song object
	 * @returns {Promise<Message>}
	*/
	async exec(message, queue, song) {
		const { channel } = message;
		const { 
			name, url, user, 
			thumbnail, views 
		} = song;

		await channel.send({ embed: {
			title: 'Now Playing',
			thumbnail: { url: thumbnail },
			color: 'ORANGE',
			description: `Now playing [**__${name}__**](${url}) on the queue.`,
			fields: [
				{ inline: true, 
					name: 'Duration', value: `\`${formattedDuration}\`` },
				{ inline: true, 
					name: 'Requested by', value: user.tag },
				{ inline: true, 
					name: 'Views', value: `\`${views.toLocaleString()}\`` },
			],
			timestamp: Date.now(),
			footer: {
				text: this.client.user.username,
				iconURL: this.client.user.avatarURL()
			}
		}});
	}
}