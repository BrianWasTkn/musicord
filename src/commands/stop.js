import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'

export default new Command({
	name: 'stop',
	aliases: ['shutup'],
	description: 'stop the queue',
	usage: 'command',
	cooldown: 3e3,
	music: true
}, async (bot, message) => {
	
	/** Check Playing State */
	const isPlaying = bot.player.isPlaying(message);
	if (!isPlaying) {
		return 'There\'s nothing playing in the queue.'
	}

	/** Do the thing */
	try {
		await bot.player.stop(message)
	} catch(error) {
		log('commandError', 'stop', error)
		return error;
	}
})