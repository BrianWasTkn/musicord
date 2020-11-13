export async function run(bot) {
	try {
			const emotes = {
			success: ':white_check_mark:',
			error: ':x:',
			queue: ':ping_pong:'
		}

		const status = (queue) => ({
			looped: queue.repeatMode ? queue.repeatMode === 2 ? 'Server Queue' : 'Current Track' : 'Off',
			volume: `${queue.volume}%`,
			autoPlay: queue.autoPlay ? 'on' : "off"
		})

		bot.player
		.on('playSong', async (message, queue, song) => {
			message.channel.send(`
**__${emotes.success} | Now Playing__**
**Song:** ${song.name}
**Duration:** ${song.formattedDuration}
**Requested by:** ${song.user.tag}
				`)
		})
		.on('addSong', async (message, queue, song) => {
			message.channel.send(`
**__${emotes.success} | Added track to queue__**
**Song:** ${song.name}
**Duration:** ${song.formattedDuration}
**Added by:** ${song.user.tag}

**__${emotes.queue} | Queue Status__**
**Volume:** ${status(queue).volume}
**Loop State:** ${status(queue).looped}
**Auto Play:** ${status(queue).autoPlay}
				`)
		})
		.on('noRelated', async message => {
			message.channel.send(`
**__${emotes.error} | Nothing found__**
Cannot find anything from your query.
				`)
		})
		.on('finish', async message => {
			message.channel.send(`
**__${emotes.queue} | Finished Playing__**
The queue finished playing all the songs in queue.
				`)
		})
		.on('empty', async message => {
			message.channel.send(`
**__${emotes.error} | Channel Empty__**
The channel is now empty, leaving channel...
				`)
			await message.member.voice.channel.leave()
		})
		.on('addList', async (message, queue, playlist) => {
			message.channel.send(`
**__${emotes.success} | Added playlist to queue**
Successfully added **${playlist.name}** (**${playlist.songs.length}** songs) in the queue.
				`)
		})
		.on('searchResult', async (message, result) => {
			let index = 0;
			message.channel.send(`
**__${emotes.queue} | Search Results__**
${results.map(song => `
\`\`\`c
**# | Song**
**${++index}** | [${song.name}](${song.url})
\`\`\`
`).join('\n')}

Type the number of your choice. 
You can type \`cancel\` to cancel your search.
				`)
		})
		.on('searchCancel', async (message) => {
			message.channel.send(`
**__${emotes.success} | Cancelled__**
You cancelled searching for a song.
				`)
		})
		.on('error', async (message, err) => {
			message.channel.send(`
**__${emotes.error} | Error__**
${err}
				`)
		})
	} catch(error) {
		console.error(error)
	}
}