import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'
import { 
	simpleEmbed, 
	generateError 
} from '../utils/embed.js'

export default new Command({
	name: 'skip',
	aliases: ['playnext', 's'],
	description: 'skip the current track',
	usage: 'command'
}, async (bot, message) => {
	
	/** Check Playing State */
	const queue = bot.player.getQueue(message);
	if (!queue) {
		return simpleEmbed(message, 'There\'s nothing playing in the queue.');
	}

	/** Do the thing */
	try {
		await bot.player.skip(message);
	} catch(error) {
		log('commandError', 'skip', error)
		return generateError(message, error);
	}
})