import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'
import { 
	simpleEmbed, 
	errorEmbed 
} from '../utils/embed.js'

export default new Command({
	name: 'loop',
	aliases: ['repeat'],
	description: 'loop either the current track or the whole queue.',
	usage: '<queue | song | off>'
}, async (bot, message, [method]) => {
	
	/** Check Playing State */
	const queue = bot.player.getQueue(message);
	if (!queue) {
		return simpleEmbed(message, 'There\'s nothing playing in the queue.');
	}

	try {
		// modes
		method = method.toLowerCase();
		let mode;
		if (['queue', 'playlist'].includes(method)) {
			mode = 2;
		} else if (['song', 'track', 'true'].includes(method)) {
			mode = 1;
		} else if (['off', 'false'].includes(method)) {
			mode = 0;
		} else {
			return simpleEmbed(message, 'Your options are: "queue", "track" or "off" only.');
		}
		
		// then set
		const queue = await bot.player.setRepeatMode(message, mode);
		return simpleEmbed(message, queue.repeatMode 
			? queue.repeatMode == 2 
				? 'Now looping the queue.'
				: 'Now looping the current track.'
			: 'Loop is now off.')
	} catch(error) {
		log('commandError', 'loop@loop', error)
		return errorEmbed(message, error);
	}
})