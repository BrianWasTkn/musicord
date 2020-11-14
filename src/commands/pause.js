import Command from '../classes/Command.js'
import { logError } from '../utils/logger.js'

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
		return 'The player has been paused.'
	} catch(error) {
		logError('Command',' Unable to pause the queue', error)
	}
})