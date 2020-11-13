export async function run(bot) {
	try {

		// emojis
		const emotes = {
			music: ':musical_note:',
			success: ':white_check_mark:',
			error: ':x:',
			queue: ':ping_pong:'
		}

		// queue status
		const status = (queue) => ({
			looped: queue.repeatMode ? queue.repeatMode === 2 ? 'queue' : 'track' : 'off',
			volume: `${queue.volume}%`,
			autoPlay: queue.autoPlay ? 'on' : "off"
		})

		// all events
		bot.player
		.on('playSong', async (message, queue, song) => {
			message.channel.send({
				embed: {
					title: `**__${emotes.music} Now Playing__**`,
					color: 'BLUE',
					fields: [
						{ name: '**Song**', value: `[${song.name}](${song.url})` },
						{ name: '**Duration**', value: song.formattedDuration },
						{ name: '**Requested by**', value: song.user.tag }
					]
				}
			})
		})
		.on('addSong', async (message, queue, song) => {
			message.channel.send({
				embed: {
					title: `**__${emotes.music} Added to Queue__**`,
					color: 'BLUE',
					fields: [
						{ name: '**Song**', value: `[${song.name}](${song.url})` },
						{ name: '**Duration**', value: song.formattedDuration },
						{ name: '**Added by**', value: song.user.tag }
					],
					footer: {
						text: `Volume: ${status(queue).volume}% | Loop: ${status(queue).looped}`
					}
				}
			})
		})
		.on('noRelated', async message => {
			message.channel.send({
				embed: {
					title: `**__${emotes.error} Nothing Found__**`,
					color: 'RED',
					description: '**No related song has been found.**'
				}
			})
		})
		.on('finish', async message => {
			message.channel.send({
				embed: {
					title: `**__${emotes.success} Finished Playing__**`,
					color: 'GREEN',
					description: '**The queue finished playing all songs in queue.**'
				}
			})
		})
		.on('empty', async message => {
			await message.member.voice.channel.leave();
			message.channel.send({
				embed: {
					title: `**__${emotes.music} Channel Empty__**`,
					color: 'ORANGE',
					description: '**The channel is now empty, leaving channel...**'
				}
			})
		})
		.on('addList', async (message, queue, playlist) => {
			message.channel.send({
				embed: {
					title: `**__${emotes.success} | ${playlist.songs.length} songs added__**`,
					color: 'BLUE',
					description: `Playlist **${playlist.name}** added to the queue.`
				}
			})
		})
		.on('searchResult', async (message, result) => {
			message.channel.send({
				embed: {
					title: `**__${emotes.success} Search Results__**`,
					color: 'BLUE',
					description: results.map((song, index) => `**${index + 1}.** [**__${song.name}__**](${song.url}) - \`${song.formattedDuration}\``),
					fields: [
						{ name: '**__Instructions:__**', value: '**Type the number of your choice.\nYou can type `cancel` to cancel your search.**' }
					]
				}
			})
		})
		.on('searchCancel', async (message) => {
			message.channel.send({
				embed: {
					title: `**__${emotes.success} Search Cancelled__**`,
					color: 'RED',
					description: 'You cancelled the search!'
				}
			})
		})
		.on('error', async (message, err) => {
			message.channel.send({
				embed: {
					title: `**__${emotes.error} Player Error__**`,
					color: 'RED',
					description: err
				}
			})
		})
	} catch(error) {
		console.error(error)
	}
}