import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'

export default new Command({
	name: 'remove',
	aliases: ['rid'],
	description: 'remove a song from a queue.',
	usage: '<index: Number>',
	cooldown: 3e3,
	music: true
}, async (bot, message, args) => {

	/** Check Playing State */
	const isPlaying = bot.player.isPlaying(message);
	if (!isPlaying) {
		return 'There\'s nothing playing in the queue.'
	}

	/** Else, play */
	try {
		const queue = bot.player.getQueue(message);
		if (!queue) return 'There\'s nothing in the queue.';
		const index = parseInt(args[0], 10);
		if (!index || isNaN(args[0])) return 'You need a valid index number.';
		if (index > queue.songs.length || index < 1) return 'No song found on that index number.';
		const song = queue.songs[index - 1];
		await bot.player.remove(message, index - 1);
		return {
			title: 'Track Removed',
			color: 'BLUE',
			description: `User **${message.author.tag}** removed **${song.name}** from the queue.`
		}
	} catch(error) {
		log('commandError', 'remove', error)
		return error;
	}
})