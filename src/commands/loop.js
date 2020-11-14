import Command from '../classes/Command.js'
import { logError } from '../utils/logger.js'

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
	let repeatMode;
	switch(method) {
		case 'queue':
			repeatMode = 2
			break;
		case 'song':
		case 'track':
			repeatMode = 1
			break;
		default:
			repeatMode = 0
	}

	/** Do the thing */
	try {
		const queue = await bot.player.setRepeatMode(message, repeatMode);
		return queue.repeatMode ? queue.repeatMode === 0 ? 'Loop is now **__off__**' : queue.repeatMode === 1 ? 'Now looping **__current track__**' : 'Now looping **__queue__**'
	} catch(error) {
		logError('Command', 'Unable to skip the current track', error)
	}
})