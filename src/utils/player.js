/**
 * BrianWasTkn 2020
 * Functions to easily call to reduce typings in commands.
*/

import { log } from './logger.js'
import { dynamicEmbed } from './embed.js'

const repeatMode = queue => {
	return queue.repeatMode 
	? queue.repeatMode === 2 
		? 0 
		: 2 
	: 1;
}

const addReactions = (msg, emojis) => {
	try {
		for await (const emoji of emojis) {
			// A timeout to avoid rateLimits.
			setTimeout(() => {
				msg.react(emoji)
			}, 1000);
		}
	} catch (error) {
		log('error', 'playerReactionCollector@add_reactions', error)
	}
}

/** Reaction Collector */
export const startReactionCollector = async (message, embed, time) => {
	try {
		/** Reactions */
		const emojis = ['⏮️', '⏭️', '⏸️', '⏹️', '🔁', '🔀']; // [prev, next, pause, stop, repeat, shuffle, cancel]
		try {
			await addReactions(emojis)
		} catch(error) {
			log('error', 'playerReactionCollector@startReactionCollector');
			return;
		}

		try {
			/** Collectors */
			const filter = (reaction, user) => user.id !== message.client.user.id && user.id === message.author.id;
			const collector = await embed.createReactionCollector(filter, {
				time: time
			})

			collector.on('stop', async (reaction, user) => {
				embed.reactions.removeAll();
			}).on('collect', async (reaction, user) => {
				switch(reaction.emoji.name) {
					// Previous Song
					case emojis[0]:
					try {
						await message.channel.send('Coming Soon:tm:')
					} catch(error) {
						log('error', 'playerReactionCollector@send_message', error);
					}
					break;

					// Next Song
					case emojis[1]:
					try {
						await message.client.player.skip(message);
					} catch(error) {
						log('error', 'playerReactionCollector@skip', error);
					}
					break;

					// Pause
					case emojis[2]: 
					try {
						await message.client.player.pause(message);
						try {
							await message.channel.send(dynamicEmbed({
								title: 'Track Paused',
								color: 'BLUE',
								fields: {
									'Action Taken': { content: 'pause', inline: true },
									'Requested by': { content: user.tag, inline: true }
								},
								footer: {
									text: `Thanks for using ${message.client.user.username}!`,
									icon: message.client.user.avatarURL()
								}
							}));
						} catch(error) {
							log('error', 'playerReactionCollector@send_message', error);
						}
					} catch(error) {
						log('error', 'playerReactionCollector@pause', error);
					}
					break;

					// Stop
					case emojis[3]:
					try {
						await message.client.player.stop(message);
						try {
							await message.channel.send(dynamicEmbed({
								title: 'Player Stopped',
								color: 'BLUE',
								fields: {
									'Action Taken': { content: 'stop', inline: true },
									'Requested by': { content: user.tag, inline: true }
								},
								footer: {
									text: `Thanks for using ${message.client.user.username}!`,
									icon: message.client.user.avatarURL()
								}
							}));
						} catch(error) {
							log('error', 'playerReactionCollector@send_stop_message', error);
						}
					} catch(error) {
						log('error', 'playerReactionCollector@stop', error);
					}
					break;

					// Loop
					case emojis[4]:
					try {
						const queue = message.client.player.getQueue(message);
						await message.client.player.setRepeatMode(message, repeatMode(queue));
						try {
							await message.channel.send(dynamicEmbed({
								title: 'Repeat Mode',
								color: 'BLUE',
								info: queue.repeatMode ? queue.repeatMode === 2 ? 'Now looping the **__queue__**' : 'Now looping the **__song__**' : 'Loop is now **__off__**'
							}))
						} catch(error) {
							log('error', 'playerReactionCollector@send_message', error);
						}
					} catch(error) {
						log('error', 'playerReactionCollector@getQueue', error);
					}
					break;

					// Shuffle
					case emojis[5]:
					try {
						const queue = message.client.player.shuffle(message);
						try {
							await message.channel.send(dynamicEmbed({
								title: 'Queue Shuffled',
								color: 'BLUE',
								fields: {
									'Action Taken': { content: 'shuffle', inline: true },
									'Requested by': { content: user.tag, inline: true }
								},
								footer: {
									text: `Thanks for using ${message.client.user.username}!`,
									icon: message.client.user.avatarURL()
								}
							}));
						} catch(error) {
							log('error', 'playerReactionCollector@send_message', error);
						}
					} catch(error) {
						log('error', 'playerReactionCollector@shuffle', error);
					}
					break;

					// stop collector
					case emojis[6]:
					try {
						await collector.stop();
						try { 
							await embed.reactions.removeAll(); 
						} catch { 
							log('error', 'playerReactionCollector@remove_reactions', error) 
						}
					} catch(error) {
						log('error', 'playerReactionCollector@stop_collector', error)
					}
					break;
				}
			})
		} catch(error) {
			log('error', 'playerReactionCollector@main_collector', error)
		}
	} catch(error) {
		log('error', 'playerReactionCollector@start_collector', error)
	}
}