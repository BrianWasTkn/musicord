import { log } from './logger.js'

const addReactions = (msg, emojis) => {
	try {
		for await (const emoji of emojis) {
			// A timeout to avoid rateLimits.
			setTimeout(async () => {
				msg.react(emoji)
			}, 1000);
		}
		return true;
	} catch (error) {
		log('error', 'playerReactionCollector@add_reactions', error)
	}
}

export const startReactionCollector = async (message, embed, time) => {
	try {
		/** Reactions */
		const emojis = ['⏮️', '⏭️', '⏸️', '⏹️', '🔁', '🔀']; // [prev, next, pause, stop, repeat, shuffle]

		try {
			await addReactions(emojis)
		} catch(error) {
			log('error', 'playerReactionCollector@startReactionCollector')
		}
		const filter = (reaction, user) => user.id !== message.client.user.id && user.id === message.author.id;
		const collector = await embed.createReactionCollector(filter, {
			time: 60000
		})

		collector.on('collect', async (reaction, user) => {
			switch(reaction.emoji.name) {
				case emojis[0]:
					await message.channel.send('Coming Soon:tm:')
					break;
				case emojis[1]:
					await message.client.player.skip(message)
					break;
				case emojis[2]: 
					await message.client.player.pause(message)
					break;
				case emojis[3]:
					await message.client.player.stop(message)
					break;
				case emojis[4]:
					const queue = message.client.player.getQueue(message);
					const mode = queue.repeatMode ? queue.repeatMode === 0 ? 2 : 1 : 0;
					await message.client.player.setRepeatMode(message, mode)
					break;
				case emojis[5]:
					await message.client.player.shuffle(message);
					break;
				case emojis[6]:
					try {
						embed.reactions.removeAll()
						collector.stop();
					} catch(error) {
						log('error', 'playerReactionCollector@remove_emotes', error)
					}
					break;
			}
		})

		collector.on('stop', async (reaction, user) => {
			embed.reactions.removeAll()
		})
	} catch(error) {
		log('error', 'playerReactionCollector@start_collector', error)
	}
}