export async function run() {
	const { distube } = this;
	distube
	.on('playSong', async (message, queue, song) => {
		const { channel, client } = message;
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
				text: client.user.username,
				iconURL: client.user.avatarURL()
			}
		}});
	})
	.on('addSong', async (message, queue, song) => {
		const { channel, client } = message;
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
				text: client.user.username,
				iconURL: client.user.avatarURL()
			}
		}});
	})
}