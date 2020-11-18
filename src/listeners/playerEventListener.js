import { log } from '../utils/logger.js'

export async function run(bot) {
	try {
		/** Distube#Events */
		bot.player.on('playSong', async (message, queue, song) => {
			await message.channel.send({
				embed: {
					title: 'Now Playing',
					color: 'BLUE',
					description: `Now playing [**__${song.name}__**](${song.url}) on the queue.`,
					fields: [
						{ name: 'Duration', value: `\`${song.formattedDuration}\``, inline: true },
						{ name: 'Requested by', value: song.user.tag, inline: true },
						{ name: 'Views', value: song.views.toLocaleString(), inline: true }
					],
					footer: { text: `Run "crib search" or "crib play" to search or play a track.` }
				}
			})
		}).on('addSong', async (message, queue, song) => {
			await message.channel.send({
				embed: {
					title: 'Added to Queue',
					color: 'BLUE',
					description: `Added [**__${song.name}__**](${song.url}) to the queue.`,
					fields: [
						{ name: 'Duration', value: `\`${song.formattedDuration}\``, inline: true },
						{ name: 'Added by', value: song.user.tag, inline: true },
						{ name: 'Views', value: song.views.toLocaleString(), inline: true }
					],
					footer: { text: `Run "crib search" or "crib play" to search or play more tracks.` }
				}
			})
		}).on('initQueue', async queue => {
			queue.volume = 100;
			await queue.initMessage.channel.send({
				embed: {
					title: 'Queue Options',
					color: 'BLUE',
					description: 'The following options are applied by default whenever this server opens a new queue.',
					fields: [
						{ name: 'Volume', value: queue.volume, inline: true },
						{ name: 'Loop', value: queue.repeatMode ? queue.repeatMode === 2 ? 'Queue' : 'Track' : off, inline: true },
						{ name: 'Autoplay', value: queue.autoplay, inline: true },
						{ name: 'Paused', value: queue.pause, inline: true },
						{ name: 'Last Skipped', value: queue.skipped, inline: true },
						{ name: 'Stopped', value: queue.stopped, inline: true }
					],
					footer: { text: `Run "crib search" or "crib play" to search or play more tracks.` }
				}
			})
		}).on('noRelated', async message => {
			await message.channel.send({
				embed: {
					title: 'Nothing Found',
					color: 'BLUE',
					description: 'No track(s) were found related to the previous track.\nYou can run `crib search` or `crib play` to search or play a track.',
					footer: { text: `Thanks for using ${message.client.user.username}!` }
				}
			})
		}).on('finish', async message => {
			await message.channel.send({
				embed: {
					title: 'Queue Finished',
					color: 'BLUE',
					description: 'The queue has finished playing all queued songs.\nYou can run `crib search` or `crib play` to search or play a track.',
					footer: { text: `Thanks for using ${message.client.user.username}!` }
				}
			})
		}).on('empty', async message => {
			await message.channel.send({
				embed: {
					title: 'Channel Empty',
					color: 'BLUE',
					description: 'Voice channel was empty after **60 seconds** from being empty.\nSuccessfully left the voice channel.',
					footer: { text: `Thanks for using ${message.client.user.username}!` }
				}
			})
		}).on('addList', async (message, queue, playlist) => {
			await message.channel.send({
				embed: {
					title: 'Added to Queue',
					color: 'BLUE',
					description: `Added [**__${playlist.name}__**](${playlist.url}) with **${playlist.songs.length}** into the queue.`,
					fields: [
						{ name: 'Duration', value: `\`${playlist.formattedDuration}\``, inline: true },
						{ name: 'Added by', value: playlist.user.tag, inline: true }
					],
					footer: { text: `Run "crib search" or "crib play" to search or play more tracks.` }
				}
			})
		}).on('searchResult', async (message, result) => {
			result = result.slice(0, 10).map((song, index) => `**#${index + 1}:** [__${song.name}__](${song.url}) - \`${song.formattedDuration}\``) // Slice the results from 15 => 10
			await message.channel.send({
				embed: {
					title: `Found ${result.length} tracks`,
					color: 'BLUE',
					description: result.join('\n'),
					fields: [
						{ name: 'Instructions', value: 'Type the **number** of your choice.\nYou can cancel by typing out `cancel` right now.' }
					],
					footer: { text: 'You have 30 seconds to proceed otherwise your search is cancelled.' }
				}
			})
		}).on('searchCancel', async message => {
			await message.channel.send({
				embed: {
					title: 'Seach Cancelled',
					color: 'BLUE',
					description: 'You cancelled the search!',
					footer: { text: `Run "crib search" or "crib play" to search or play more tracks.` }
				}
			})
		}).on('error', async (message, err) => {
			await message.channel.send({
				embed: {
					title: 'Player Error',
					color: 'RED',
					description: message.client.utils.codeBlock(err, 'js'),
					footer: { text: `Run "crib search" or "crib play" to search or play more tracks.` }
				}
			})
		})
		
		log('main', 'DisTube Event Emitter')
	} catch(error) {
		log('listenerError', 'disTubeEventEmitter', error)
	}
}