import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'
import { 
	simpleEmbed, 
	generateError 
} from '../utils/embed.js'

export default new Command({
	name: 'remove',
	aliases: ['rid'],
	description: 'remove a song from a queue.',
	usage: '<index>'
}, async (bot, message, args) => {

	/** Check Playing State */
	const queue = bot.player.getQueue(message);
	if (!queue) {
		return simpleEmbed(message, 'There\'s nothing playing in the queue.');
	}

	/** Else, remove */
	try {
		const index = parseInt(args[0], 10);
		// index isNaN or empty
		if (!index || isNaN(args[0])) {
			return simpleEmbed(message, 'You need a valid index number.');
		}
		// index is above or below queue.songs.length
		if (index > queue.songs.length || index < 1) {
			return simpleEmbed(message, 'No song found on that index number.');
		}
		// removal process
		const song = queue.songs[index - 1];
		await bot.player.remove(message, index - 1);
		// return an embed
		return {
			title: 'Track Removed',
			color: 'BLUE',
			description: `User **${message.author.tag}** removed **${song.name}** from the queue.`
		}
	} catch(error) {
		log('commandError', 'remove@remove_track', error.stack);
		return generateError(message, error);
	}
})