import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'
import { 
	simpleEmbed, 
	generateErrorEmbed 
} from '../utils/embed.js'

export default new Command({
	name: 'stop',
	aliases: ['shutup'],
	description: 'stop the queue',
	usage: 'command'
}, async (bot, message) => {
	
	/** Check Playing State */
	const queue = bot.player.getQueue(message);
	if (!queue) {
		return simpleEmbed(message, 'There\'s nothing playing in the queue.');
	}

	/** Do the thing */
	try {
		await bot.player.stop(message);
	} catch(error) {
		log('commandError', 'stop', error)
		return generateErrorEmbed(message, error);
	}
})