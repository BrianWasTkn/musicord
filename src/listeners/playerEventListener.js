import { log } from '../utils/logger.js'
import { codeBlock } from '../utils/text.js'
import { dynamicEmbed as embedify } from '../utils/embed.js'

export async function run(bot) {
	try {
		/** Functions */
		const code = string => {
			return '\`' + string + '\`';
		}
		const repeatMode = queue => {
			return queue.repeatMode 
			? queue.repeatMode === 2 
				? 'Queue' 
				: 'Track' 
			: 'None';
		}

		/** Distube#Events */
		bot.player.on('playSong', async (message, queue, song) => {
			await message.channel.send(embedify({
				title: 'Now Playing',
				color: 'BLUE',
				text: `Now Playing [**__${song.name}__**](${song.url}) on the queue.`,
				fields: {
					'Duration': { 		content: code(song.formattedDuration),	inline: true },
					'Requested by': { content: song.user.tag, 								inline: true },
					'# of Plays': { 	content: song.views.toLocaleString(), 	inline: true }
				},
				footer: {
					text: `Thanks for using ${bot.user.username}!`,
					icon: bot.user.avatarURL()
				}
			}));
		}).on('addSong', async (message, queue, song) => {
			await message.channel.send(embedify({
				title: 'Added to Queue',
				color: 'BLUE',
				text: `Added [**__${song.name}__**](${song.url}) to the queue.`,
				fields: {
					'Duration': { 	content: code(song.formattedDuration), 	inline: true },
					'Added by': { 	content: song.user.tag, 								inline: true },
					'# of Plays': { content: song.views.toLocaleString(), 	inline: true }
				},
				footer: {
					text: `Thanks for using ${bot.user.username}!`,
					icon: bot.user.avatarURL()
				}
			}));
		}).on('addList', async (message, queue, playlist) => {
			await message.channel.send(embedify({
				title: 'Added to Queue',
				color: 'BLUE',
				text: `Added [**__${playlist.name}__**](${playlist.url}) with **${playlist.songs.length}** items to the queue.`,
				fields: {
					'Duration': { content: code(playlist.formattedDuration),	inline: true },
					'Added by': { content: playlist.user.tag,									inline: true }
				},
				footer: {
					text: `Thanks for using ${bot.user.username}!`,
					icon: bot.user.avatarURL()
				}
			}));
		}).on('searchResult', async (message, result) => {
			result = result.slice(0, 10).map((song, index) => `**#${index + 1}:** [__${song.name}__](${song.url}) - \`${song.formattedDuration}\``) // Slice the results from 15 => 10
			await message.channel.send(embedify({
				title: 'Search Results',
				color: 'BLUE',
				text: result.join('\n'),
				fields: {
					'Instructions': { content: 'Type the **number** of your choice to start playing that track.\nYou can type **cancel** if you wanna cancel your search.' }
				},
				footer: {
					text: `Thanks for using ${bot.user.username}!`,
					icon: bot.user.avatarURL()
				}
			}));
		}).on('searchCancel', async message => {
			await message.channel.send(embedify({
				title: 'Search Cancelled',
				color: 'RED',
				text: 'You\'ve either done the following so your search has been cancelled:',
				fields: {
					'Idle': { content: 'You have not been answering me for **30 seconds** so your search has been timed-out.' },
					'NaN': {  content: 'Or **Not a Number**, you might\'ve mistyped something instead of the index number of the track.' }
				},
				footer: {
					text: `Thanks for using ${bot.user.username}!`,
					icon: bot.user.avatarURL()
				}
			}));
		}).on('initQueue', async queue => {
			await queue.initMessage.channel.send(embedify({
				title: 'Queue Settings',
				color: 'BLUE',
				text: 'The following configurations are automatically applied by **default** whenever the server starts queuing songs.',
				fields: {
					'Volume': { 	content: queue.volume, 			inline: true },
					'Loop': { 		content: repeatMode(queue), inline: true },
					'Autoplay': { content: queue.autoplay, 		inline: true },
					'Paused': { 	content: queue.pause, 			inline: true },
					'Skipped': { 	content: queue.skipped, 		inline: true },
					'Stopped': { 	content: queue.stopped, 		inline: true }
				},
				footer: {
					text: `Thanks for using ${bot.user.username}!`,
					icon: bot.user.avatarURL()
				}
			}));
		}).on('noRelated', async message => {
			await message.channel.send(embedify({
				title: 'Nothing Found',
				color: 'RED',
				text: 'No tracks were found related to the previous track that was played in the queue.',
				footer: { 
					text: `Thanks for using ${bot.user.username}!`,
					icon: bot.user.avatarURL() 
				}
			}));
		}).on('finish', async message => {
			await message.channel.send(embedify({
				title: 'Player Finished',
				color: 'BLUE',
				text: 'The queue has finished playing all the songs in the queue.',
				footer: {
					text: `Thanks for using ${bot.user.username}!`,
					icon: bot.user.avatarURL()
				}
			}));
		}).on('empty', async message => {
			await message.channel.send(embedify({
				title: 'Channel Empty',
				color: 'RED',
				text: 'The voice channel is now empty.',
				footer: {
					text: `Thanks for using ${bot.user.username}!`
				}
			}));
		}).on('error', async (message, err) => {
			await message.channel.send(embedify({
				title: 'Player Error',
				color: 'RED',
				text: codeBlock(err, 'js'),
				footer: {
					text: `Thanks for using ${bot.user.username}!`,
					icon: bot.user.avatarURL()
				}
			}));
		})
		
		log('main', 'DisTube Event Emitter')
	} catch(error) {
		log('listenerError', 'disTubeEventEmitter', error)
	}
}