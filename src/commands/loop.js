import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'

export default new Command({
	name: 'loop',
	aliases: ['repeat'],
	description: 'loop either the current track or the whole queue.',
	usage: '<queue | song | off>'
}, async (bot, message, [method]) => {
	
	/** Check Playing State */
	const isPlaying = bot.player.isPlaying(message);
	if (!isPlaying) {
		return 'There\'s nothing playing in the queue.'
	}

	/** Methods */
	method = method.toLowerCase();
	if (['queue'].includes(method)) mode = 2;
	else if (['song', 'track'].includes(method)) mode = 1;
	else mode = 0;

	/** Do the thing */
	try {
		const queue = await bot.player.setRepeatMode(message, mode);
		return queue.repeatMode ? queue.repeatMode == 2 ? 'Now looping the **__whole queue__**' : 'Now repeating the **__current track__**' : 'Loop is now **__off__**'
	} catch(error) {
		log('commandError', 'loop', error)
		return error;
	}
})