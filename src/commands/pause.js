import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'

export default new Command({
	name: 'pause',
	aliases: ['freeze'],
	description: 'pause the current playing track',
	usage: 'command',
	cooldown: 3e3,
	music: true
}, async (bot, message, args) => {

	/** Check Playing State */
	const isPlaying = bot.player.isPlaying(message);
	if (!isPlaying) {
		return 'There\'s nothing playing in the queue.'
	}

	/** Check if paused */
	const paused = bot.player.isPaused(message);
	if (paused) {
		return 'The player is already paused.'
	}

	/** Else, pause */
	try {
		await bot.player.pause(message);
		await message.channel.send({ 
			embed: {
				title: 'Player Paused',
				color: 'BLUE',
				description: `User **${message.author.tag}** has paused the queue.`
			}
		})
	} catch(error) {
		log('commandError', 'pause', error)
		return error;
	}
})