import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'
import { 
	simpleEmbed, 
	errorEmbed 
} from '../utils/embed.js'

export default new Command({
	name: 'queue',
	aliases: ['q'],
	description: 'sends a list of songs on the queue of your server.',
	usage: '[--clear]'
}, async (bot, message, args) => {

	/** Check Playing State */
	const queue = bot.player.getQueue(message);
	if (!queue) {
		return simpleEmbed(message, 'There\'s nothing playing in the queue.');
	}

	/** Check if args contains a flag to clear the queue */
	if (args.join(' ').includes('--clear')) {
		await bot.player.stop(message)
		return simpleEmbed(message, 'The player has been stopped and the queue has been cleared.');
	}

	/** Map Songs */
	const songs = queue ? queue.songs.map((song, index) => `**${index === 0 ? ':musical_note:' : `#${index + 1}:`}** [__${song.name}__](${song.url}) - \`${song.formattedDuration}\` `) : false;
	
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
			const emojis = ['⏮️', '⏭️', '⏸️', '⏹️', '🔁', '🔀', ':x:'];
			for await (const emoji of emojis) {
				setTimeout(() => {
					msg.react(emoji);
				}, 1000)
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
							await reaction.users.remove(user);
							await collector.resetTimer();
							try {
								await bot.player.skip(message);
							} catch(error) {
								log('commandError', 'queue@collector -> switch -> skip', error) 
							}
						} catch (error) { 
							log('commandError', 'queue@collector -> switch -> removeReaction', error)
						}
						break;

					// Pause
					case emojis[2]:
						try { 
							await reaction.users.remove(user);
							await collector.resetTimer();
							try {
								await bot.player.pause(message);
							} catch(error) {
								log('commandError', 'queue@collector -> switch -> pause', error) 
							}
						} catch (error) { 
							log('commandError', 'queue@collector -> switch -> removeReaction', error)
						}
						break;

					// Stop
					case emojis[3]:
						try { 
							await reaction.users.remove(user);
							await collector.resetTimer();
							try {
								await bot.player.stop(message);
								collector.stop();
							} catch(error) {
								log('commandError', 'queue@collector -> switch -> stop', error) 
							}
						} catch (error) { 
							log('commandError', 'queue@collector -> switch -> removeReaction', error)
						}
						break;

					// repeat
					case emojis[4]:
						message.channel.send('repeat');
						break;

					// shuffle
					case emojis[5]:
						try { 
							await reaction.users.remove(user);
							await collector.resetTimer();
							try {
								await bot.player.shuffle(message);
							} catch(error) {
								log('commandError', 'queue@collector -> switch -> shuffle', error) 
							}
						} catch (error) { 
							log('commandError', 'queue@collector -> switch -> removeReaction', error)
						};
						break;

					// cancel
					case emojis[6]:
					try {
						await reaction.users.removeAll();
						try {
							collector.stop();
						} catch(error) {
							log('commandError', 'queue@collector -> switch -> collector.stop', error);	
						}
					} catch(error) {
						log('commandError', 'queue@collector -> switch -> removeReactions', error);
					}
				}
			})

			/** End */
			collector.on('end', async (reaction, user) => {
				await message.channel.send('ended')
				await msg.reactions.removeAll()
			})
		} catch (error) {
			log('commandError', 'queue@create_collector', error.stack);
			return errorEmbed(message, error);
		}
	} catch(error) {
		log('commandError', 'queue@send_queue_msg', error.stack);
		return errorEmbed(message, error);
	}
})