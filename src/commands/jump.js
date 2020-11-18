import Command from '../classes/Command.js'
import { log } from '../utils/logger.js'

export default new Command({
	name: 'jump',
	aliases: ['skipto'],
	description: 'skip to a specified index in the queue.',
	usage: '<index: Number>',
	cooldown: 3e3,
	music: true
}, async (bot, message, [method]) => {
	
	/** Check Playing State */
	const isPlaying = bot.player.isPlaying(message);
	if (!isPlaying) {
		return 'There\'s nothing playing in the queue.'
	}

	/** Index */
	if (isNaN(args[0])) return 'You need a valid number.';
	const index = parseInt(args[0], 10),
	queue = bot.player.getQueue(message);
	if (!queue) return 'There\'s nothing playing in the queue.';
	if (index > queue.songs.length) return 'Your given index is greater than the length of the songs in the queue.';

	/** Do the thing */
	try {
		await bot.player.jump(message, index);
	} catch(error) {
		log('commandError', 'loop', error)
		return error;
	}
})