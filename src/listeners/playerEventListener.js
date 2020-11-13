import { logInit, logError } from '../utils/logger.js'

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
			volume: queue.volume,
			autoPlay: queue.autoPlay ? 'on' : 'off'
		})

		// all events
		bot.player
		.on('playSong', async (message, queue, song) => {
			message.channel.send({
				embed: {
					author: {
						name: 'Now Playing',
						iconURL: bot.user.avatarURL()
					},
					color: 'BLUE',
					fields: [
						{ name: 'Song', value: `[${song.name}](${song.url})`, inline: true },
						{ name: 'Duration', value: `\`${song.formattedDuration}\``, inline: true },
					],
					footer: {
						text: `Requested by ${song.user.tag}`,
						iconURL: message.author.avatarURL()
					}
				}
			})
		})
		.on('addSong', async (message, queue, song) => {
			message.channel.send({
				embed: {
					author: {
						name: 'Added to Queue',
						iconURL: bot.user.avatarURL()
					},
					color: 'BLUE',
					fields: [
						{ name: 'Song', value: `[${song.name}](${song.url})` },
						{ name: 'Duration', value: `\`${song.formattedDuration}\`` }
					],
					footer: {
						text: `Requested by ${song.user.tag}`,
						iconURL: message.author.avatarURL()
					}
				}
			})
		})
		.on('noRelated', async message => {
			message.channel.send({
				embed: {
					author: {
						name: 'Nothing Found',
						iconURL: bot.user.avatarURL()
					},
					color: 'RED',
					description: '**No related song has been found.**'
				}
			})
		})
		.on('finish', async message => {
			message.channel.send({
				embed: {
					author: {
						name: 'Finished Playing',
						iconURL: bot.user.avatarURL()
					},
					color: 'BLUE',
					description: 'The queue had finished playing all the songs in the queue.'
				}
			})
		})
		.on('empty', async message => {
			message.channel.send({
				embed: {
					author: {
						name: 'Channel Empty',
						iconURL: bot.user.avatarURL()
					},
					color: 'RED',
					description: 'Voice channel is now **empty**.\nLeaving channel in **60** seconds...'
				}
			})
		})
		.on('addList', async (message, queue, playlist) => {
			message.channel.send({
				embed: {
					author: {
						name: `${playlist.songs.length} songs added`,
						iconURL: bot.user.avatarURL()
					},
					color: 'BLUE',
					description: `Playlist **${playlist.name}** added to the queue.`
				}
			})
		})
		.on('searchResult', async (message, result) => {
			message.channel.send({
				embed: {
					author: {
						name: 'Search Results',
						iconURL: bot.user.avatarURL()
					},
					color: 'BLUE',
					fields: [
						{ name: `${result.length} found`, value: result.map((song, index) => `**${index + 1}.** [**__${song.name}__**](${song.url}) - \`${song.formattedDuration}\``) },
						{ name: 'Instructions**', value: '**Type the number of your choice.\nYou can type `cancel` to cancel your search.**' }
					]
				}
			})
		})
		.on('searchCancel', async (message) => {
			message.channel.send({
				embed: {
					author: {
						name: 'Search Cancelled',
						iconURL: bot.user.avatarURL()
					},
					color: 'BLUE',
					description: 'You cancelled the search!'
				}
			})
		})
		.on('error', async (message, err) => {
			message.channel.send({
				embed: {
					author: {
						name: 'Player Error',
						iconURL: bot.user.avatarURL()
					},
					color: 'RED',
					description: err
				}
			})
		})
		logInit('Musicord', 'DisTube Event Emitter Loaded')
	} catch(error) {
		console.error(error)
	}
}