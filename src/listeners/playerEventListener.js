import { logInit, logError } from '../utils/logger.js'

export async function run(bot) {
	try {

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
						iconURL: message.guild.iconURL()
					},
					color: 'BLUE',
					fields: [
						{ name: '**__Song__**', value: `[**__${song.name}__**](${song.url})` },
						{ name: '**__Duration__**', value: `**\`${song.formattedDuration}\`**` },
					],
					footer: {
						text: `Requested by ${song.user.tag}`,
						iconURL: song.user.avatarURL()
					}
				}
			})
		})
		.on('addSong', async (message, queue, song) => {
			message.channel.send({
				embed: {
					author: {
						name: 'Added to Queue',
						iconURL: message.guild.iconURL()
					},
					color: 'BLUE',
					fields: [
						{ name: '**__Song__**', value: `[**__${song.name}__**](${song.url})` },
						{ name: '**__Duration__**', value: `**\`${song.formattedDuration}\`**` },
					],
					footer: {
						text: `Requested by ${song.user.tag}`,
						iconURL: song.user.avatarURL()
					}
				}
			})
		})
		.on('noRelated', async message => {
			message.channel.send({
				embed: {
					author: {
						name: 'Nothing Found',
						iconURL: message.guild.iconURL()
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
						iconURL: message.guild.iconURL()
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
						iconURL: message.guild.iconURL()
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
						iconURL: message.guild.iconURL()
					},
					color: 'BLUE',
					description: `Playlist **${playlist.name}** added to the queue.`
				}
			})
		})
		.on('searchResult', async (message, result) => {
			result = result.slice(0, 5) // Slice the results from 12 => 5
			message.channel.send({
				embed: {
					author: {
						name: 'Search Results',
						iconURL: message.guild.iconURL()
					},
					color: 'BLUE',
					fields: [
						{ name: `**__${result.length} songs found__**`, value: result.map((song, index) => `**#${index + 1}:** [**${song.name}**](${song.url}) - \`${song.formattedDuration}\``) },
						{ name: '**__Instructions__**', value: '**Type the number of your choice.\nYou can type `cancel` to cancel your search.**' }
					]
				}
			})
		})
		.on('searchCancel', async (message) => {
			message.channel.send({
				embed: {
					author: {
						name: 'Search Cancelled',
						iconURL: message.guild.iconURL()
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
						iconURL: message.guild.iconURL()
					},
					color: 'RED',
					description: err
				}
			})
		})
		logInit('Musicord', 'DisTube Player Events Loaded')
	} catch(error) {
		logError('Listener', 'playerEventListener', error)
	}
}