import Command from '../classes/Command.js'
import { log } from '../../utils/logger.js'

export default new Command({
	name: 'loop',
	aliases: ['repeat'],
	description: 'loop either the current track or the whole queue.',
	usage: 'command',
	cooldown: 3e3,
	music: true
}, async (bot, message, [method]) => {
	
	/** Check Playing State */
	const isPlaying = bot.player.isPlaying(message);
	if (!isPlaying) {
		return 'There\'s nothing playing in the queue.'
	}

	/** Methods */
	method = method.toLowerCase();
	const mode = method ? method === 'queue' ? 2 : 1 : 0;

	/** Do the thing */
	try {
		const queue = await bot.player.setRepeatMode(message, mode);
		return queue.repeatMode ? queue.repeatMode == 2 ? 'Now looping the **__whole queue__**' : 'Now looping the **__current track__**' : 'Loop is now **__off__**'
	} catch(error) {
		log('commandError', 'loop', error)
		return error;
	}
})