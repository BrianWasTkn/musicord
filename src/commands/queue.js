import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'
import { 
	simpleEmbed,
	dynamicEmbed, 
	errorEmbed 
} from '../utils/embed.js'

export default new Command({
	name: 'queue',
	aliases: ['q'],
	description: 'sends a list of songs on the queue of your server.',
	usage: '[--clear]'
}, async (bot, message, args) => {

	/** Check Playing State */
	try {
		const queue = bot.player.getQueue(message);
		if (!queue) {
			return simpleEmbed({
				title: 'Player Empty',
				color: 'RED',
				text: 'There\'s nothing playing in the queue.'
			})
		}

		/** Check if args contains a flag to clear the queue */
		if (args.join(' ').includes('--clear')) {
			/** Stop the queue */
			try {
				await bot.player.stop(message);
				return dynamicEmbed({
					title: 'Player Stopped',
					color: 'GREEN',
					text: `The player has been stopped and the queue has been cleared.`,
					fields: {
						'Action By': { content: message.author.tag }
					},
					footer: {
						text: `Thanks for using ${bot.user.username}!`,
						icon: bot.user.avatarURL()
					}
				});
			} catch(error) {
				log('error', 'queue@--clear_flag_stop', error.stack);
				return errorEmbed({ title: 'queue@--clear_flag_stop', error: error });
			}
		}

		/** Map Songs */
		const songs = queue.songs
		.map((song, index) => `**${index === 0 ? ':musical_note:' : `#${index + 1}:`}** [__${song.name}__](${song.url}) - \`${song.formattedDuration}\` `);
		
		/** Send Queue */
		try {
			const msg = await message.channel.send(dynamicEmbed({
				title: 'Server Queue',
				color: 'BLUE',
				fields: {
					'Currently Playing': { 	content: songs[0] },
					'Server Queue': { 			content: songs[1] ? songs.slice(1).join('\n') : 'No more left to play in queue.' }
				},
				footer: {
					text: `Thanks for using ${bot.user.username}!`,
					icon: bot.user.avatarURL()
				}
			}));

			/** Message Reactions */
			try {
				/** Emojis -> queueMessage */
				const emojis = ['⏮️', '⏭️', '⏸️', '⏹️', '🔁', '🔀', ':x:'];
				for (const emoji of emojis) {
					setTimeout(async () => {
						await msg.react(emoji);
					}, 1000) // Apply a timeout to preserve rateLimits.
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
									log('commandError', 'queue@collector -> switch -> skip', error);
									return errorEmbed({ title: 'queue@collector -> switch -> skip', error: error });
								}
							} catch (error) { 
								log('commandError', 'queue@collector -> switch -> removeReaction', error);
								return errorEmbed({ title: 'queue@collector -> switch -> removeReaction', error: error });
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
									log('commandError', 'queue@collector -> switch -> pause', error);
									return errorEmbed({ title: 'queue@collector -> switch -> pause', error: error });
								}
							} catch (error) {
								log('commandError', 'queue@collector -> switch -> removeReaction', error);
								return errorEmbed({ title: 'queue@collector -> switch -> removeReaction', error: error });
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
									log('commandError', 'queue@collector -> switch -> stop', error);
									return errorEmbed({ title: 'queue@collector -> switch -> stop', error: error });
								}
							} catch (error) { 
								log('commandError', 'queue@collector -> switch -> removeReaction', error);
								return errorEmbed({ title: 'queue@collector -> switch -> removeReaction', error: error });
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
									log('commandError', 'queue@collector -> switch -> shuffle', error);
									return errorEmbed({ title: 'queue@collector -> switch -> shuffle', error: error });
								}
							} catch (error) { 
								log('commandError', 'queue@collector -> switch -> removeReaction', error);
								return errorEmbed({ title: 'queue@collector -> switch -> removeReaction', error: error });
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
								return errorEmbed({ title: 'queue@collector -> switch -> collector.stop', error: error });
							}
						} catch(error) {
							log('commandError', 'queue@collector -> switch -> removeReactions', error);
							return errorEmbed({ title: 'queue@collector -> switch -> removeReactions', error: error });
						}
					}
				})

				/** End */
				collector.on('end', async (reaction, user) => {
					await message.channel.send('ended')
					await msg.reactions.removeAll()
				});
			} catch (error) {
				log('error', 'queue@createReactionCollector', error.stack);
				return errorEmbed({ title: 'queue@createReactionCollector', error: error });
			}
		} catch(error) {
			log('error', 'queue@send_queue_embed', error.stack);
			return errorEmbed({ title: 'queue@send_queue_embed', error: error });
		}
	} catch(error) {
		log('error', 'queue@checkQueue', error.stack);
		return errorEmbed({ title: 'queue@checkQueue', error: error });
	}

})