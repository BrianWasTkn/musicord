exports.run = async ctx => {
	const { distube } = ctx;

	distube.on('playSong', async (message, queue, song) => {
		const { thumbnail, name, url, formattedDuration, user, views } = song;
		const { guild, channel } = message;
		await channel.send({ embed: {
			title: 'Now Playing',
			color: 'GREEN',
			thumbnail: { url: thumbnail },
			description: `Now playing [**__${name}__**](${url}) on the queue.`,
			fields: [
				{ name: 'Duration', value: `\`${formattedDuration}\`` },
				{ name: 'Requested by', value: `\`${user.tag}\`` },
				{ name: 'Views', value: `\`${views.toLocaleString()}\`` },
			],
			footer: {
				text: guild.name, icon: guild.iconURL()
			}
		}});
	}).on('addSong', async (message, queue, song) => {
		const { thumbnail, name, url, formattedDuration, user, views } = song;
		const { guild, channel } = message;
		await channel.send({ embed: {
			title: 'Added to Queue',
			color: 'GREEN',
			thumbnail: { url: thumbnail },
			description: `Added [**__${name}__**](${url}) to the queue.`,
			fields: [
				{ name: 'Duration', value: `\`${formattedDuration}\`` },
				{ name: 'Added by', value: `\`${user.tag}\`` },
				{ name: 'Views', value: `\`${views.toLocaleString()}\`` },
			],
			footer: {
				text: guild.name, icon: guild.iconURL()
			}
		}});
	}).on('addList', async (message, queue, playlist) => {
		const { name, url, songs, formattedDuration, thumbnail } = playlist;
		await channel.send({ embed: {
			title: 'Added to Queue',
			color: 'GREEN',
			thumbnail: { url: thumbnail },
			description: `Added [**__${name}__**](${url}) to the queue.`,
			fields: [
				{ name: 'Duration', value: `\`${formattedDuration}\`` },
				{ name: 'Added by', value: `\`${user.tag}\`` },
				{ name: 'Total Song(s)', value: `\`${songs.length.toLocaleString()}\`` },
			],
			footer: {
				text: guild.name, icon: guild.iconURL()
			}
		}});
	})
}