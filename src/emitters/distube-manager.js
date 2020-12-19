export async function run() {
	const { distube } = this;
	distube
	.on('playSong', async (message, queue, song) => {
		const { channel, client } = message;
		await channel.send({
			title: 'Now Playing',
			thumbnail: { url: song.thumbnail },
			color: 'ORANGE',
			description: `Now playing [**__${song.name}__**](${song.url}) on the queue.`,
			fields: [
				{ inline: true, name: 'Duration', value: `\`${song.formattedDuration}\`` },
				{ inline: true, name: 'Requested by', value: song.user.tag },
				{ inline: true, name: 'Views', value: `\`${song.views.toLocaleString()}\`` },
			],
			footer: {
				text: client.user.username,
				iconURL: client.user.avatarURL()
			}
		});
	})
}