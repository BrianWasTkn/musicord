import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'
import { 
	simpleEmbed, 
	generateErrorEmbed 
} from '../utils/embed.js'

export default new Command({
	name: 'volume',
	aliases: ['set-volume'],
	description: 'set the volume of the current track.',
	usage: '<1-100>',
	cooldown: 5000
}, async (bot, message, args) => {
	
	/** Check Playing State */
	const queue = bot.player.getQueue(message);
	if (!queue) {
		return simpleEmbed(message, 'There\'s nothing playing in the queue.');
	}

	/** Parse */
	if (args.length <= 0) {
		return simpleEmbed(message, 'You need a percentage.');
	}

	/** Do the thing */
	try {
		const percent = !isNaN(args[0]) ? parseInt(args[0]) : 100;
		const queue = await bot.player.setVolume(message, percent)
		return simpleEmbed(message, `Successfully set the volume to ${queue.volume}%!`);
	} catch(error) {
		log('commandError', 'volume', error)
		return generateErrorEmbed(message, error);
	}
})