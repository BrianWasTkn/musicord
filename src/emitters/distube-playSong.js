const { Listener } = require('discord-akairo');

module.exports = class DistubePlaySong extends Listener {
	constructor() {
		super('playSong', {
			emitter: 'distube',
			event: 'playSong',
			type: 'on'
		});
	}

	async exec(message, queue, song) {
		const { channel } = message;
		await channel.send({ embed: {
			title: 'Now Playing',
			thumbnail: { url: song.thumbnail },
			color: 'ORANGE',
			description: `Now playing [**__${song.name}__**](${song.url}) on the queue.`,
			fields: [
				{ inline: true, name: 'Duration', value: `\`${song.formattedDuration}\`` },
				{ inline: true, name: 'Requested by', value: song.user.tag },
				{ inline: true, name: 'Views', value: `\`${song.views.toLocaleString()}\`` },
			],
			timestamp: Date.now(),
			footer: {
				text: this.client.user.username,
				iconURL: this.client.user.avatarURL()
			}
		}});
	}
}