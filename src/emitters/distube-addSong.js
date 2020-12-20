const { Listener } = require('discord-akairo');

module.exports = class DistubePlaySong extends Listener {
	constructor() {
		super('addSong', {
			emitter: 'distube',
			event: 'addSong',
			type: 'on'
		});
	}

	async exec(message, queue, song) {
		const { channel } = message;
		await channel.send({ embed: {
			title: 'Added to Queue',
			thumbnail: { url: song.thumbnail },
			color: 'ORANGE',
			description: `Added [**__${song.name}__**](${song.url}) into the queue.`,
			fields: [
				{ inline: true, name: 'Duration', value: `\`${song.formattedDuration}\`` },
				{ inline: true, name: 'Added by', value: song.user.tag },
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