import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'
import { 
	simpleEmbed, 
	generateError 
} from '../utils/embed.js'

export default new Command({
	name: 'jump',
	aliases: ['skipto'],
	description: 'skip to a specified index in the queue.',
	usage: '<index>'
}, async (bot, message, args) => {
	
	/** Check Playing State */
	const isPlaying = bot.player.isPlaying(message);
	if (!isPlaying) {
		return simpleEmbed(message, 'There\'s nothing playing in the queue.');
	}

	// not a number
	if (isNaN(args[0]) || args[0]) {
		return simpleEmbed(message, `Cannot parse your specified index number as number.`);
	}

	// queue limits
	const index = parseInt(args[0], 10);
	const queue = bot.player.getQueue(message);
	if (index > queue.songs.length) {
		return simpleEmbed(message, 'Your specified index is greater than the length of songs in queue.');
	} else if (index < 1) {
		return simpleEmbed(message, 'Cannot jump to songs that already been finished.');
	}

	/** Do the thing */
	try {
		await bot.player.jump(message, index - 1);
	} catch(error) {
		log('commandError', 'loop', error)
		return generateError(message, error);
	}
})