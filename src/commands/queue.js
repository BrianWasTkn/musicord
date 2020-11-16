import Command from '../classes/Command.js'
import { logError } from '../utils/logger.js'

export default new Command({
	name: 'queue',
	aliases: ['q'],
	description: 'sends a list of songs on the queue of your server.',
	usage: '[clear]',
	cooldown: 3e3,
	music: true
}, async (bot, message, args) => {

	/** Check Playing State */
	const isPlaying = bot.player.isPlaying(message);
	if (!isPlaying) {
		return 'There\'s nothing playing in the queue.'
	}

	/** Check if args contains a flag to clear the queue */
	if (args.join(' ').includes('--clear')) {
		await bot.player.stop(message)
		return bot.utils.fancyText(bot.emotes.success, 'Queue Cleared', 'The queue has been cleared.')
	}

	/** Fetch Server Queue */
	const queue = bot.player.getQueue(message);
	if (!queue) {
		return 'There\'s nothing playing in the queue.'
	}

	/** Map Songs */
	const songs = queue ? queue.songs.map((song, index) => `**${index === 0 ? ':musical_note:' : `#${index+1}:`}** [__${song.name}__](${song.url}) - \`${song.formattedDuration}\` `) : false;
	
	/** Send Queue */
	try {
		const msg = await message.channel.send({
			embed: {
				author: { name: message.guild.name, iconURL: message.guild.iconURL() },
				title: 'Server Queue',
				color: 'BLUE',
				fields: [
					{ name: 'Now Playing', value: songs[0] },
					{ name: 'Server Queue', value: songs[1] ? songs.slice(1).join('\n') : '**No more songs in queue.**' }
				]
			}
		})

		/** Message Reactions */
		try {
			/** Emojis -> queueMessage */
			const emojis = ['⏮️', '⏭️', '⏸️', '⏹️', '🔁', '🔀'];
			for (const emoji of emojis) {
				await msg.react(emoji)
			}

			/** Collector */
			const filter = (reaction, user) => user.id !== bot.user.id && user.id === message.author.id;
			const collector = await msg.createReactionCollector(filter, { time: 60000 });
			
			/** Controls */
			collector.on('collect', async (reaction, user) => {
				switch(reaction.emoji.name) {
					// Previous
					case emojis[0]:
						await message.channel.send('Coming Soon:tm:');
						break;
					// Next/Skip
					case emojis[1]:
						try { 
							await reaction.users.remove()
							try {
								await bot.player.skip(message);
							} catch(error) {
								logError('Command', 'cannot skip', error) 
							}
						} catch (error) { 
							logError('Command', 'cannot remove reaction', error) 
						}
						break;
					// Pause
					case emojis[2]:
						try { 
							await reaction.users.remove()
							try {
								await bot.player.pause(message);
							} catch(error) {
								logError('Command', 'cannot pause', error) 
							}
						} catch (error) { 
							logError('Command', 'cannot remove reaction', error) 
						}
						break;
					// Stop
					case emojis[3]:
						try { 
							await reaction.users.remove()
							try {
								await bot.player.stop(message);
							} catch(error) {
								logError('Command', 'cannot stop', error) 
							}
						} catch (error) { 
							logError('Command', 'cannot remove reaction', error) 
						}
						break;
					// repeat
					case emojis[4]:
						message.channel.send('repeat');
						break;
					// shuffle
					case emojis[5]:
					try { 
							await reaction.users.remove()
							try {
								await bot.player.shuffle(message);
							} catch(error) {
								logError('Command', 'cannot shuffle', error) 
							}
						} catch (error) { 
							logError('Command', 'cannot remove reaction', error) 
						}
						message.channel.send('shuffle');
						break;
				}
			})

			/** End */
			collector.on('end', async (reaction, user) => {
				await message.channel.send('ended')
				await msg.reactions.removeAll()
			})
		} catch (error) {
			logError('Command', 'queue', error)
		}
	} catch(error) {
		logError('Command', 'queue', error)
	}
})