import Command from '../classes/Command.js'
import { log } from '../utils/logger.js'

export default new Command({
	name: 'shuffle',
	aliases: ['randomize'],
	description: 'shuffle the current queue',
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
		await bot.player.shuffle(message)
	} catch(error) {
		log('commandError', 'shuffle', error)
		return error;
	}
})