import Command from '../classes/Command.js'
import { log } from '../utils/logger.js'

export default new Command({
	name: 'skip',
	aliases: ['playnext', 's'],
	description: 'skip the current track',
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
		await bot.player.skip(message)
	} catch(error) {
		log('commandError', 'skip', error)
		return error;
	}
})