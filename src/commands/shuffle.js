import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'
import { 
	simpleEmbed, 
	generateErrorEmbed 
} from '../utils/embed.js'

export default new Command({
	name: 'shuffle',
	aliases: ['randomize'],
	description: 'shuffle the current queue',
	usage: 'command'
}, async (bot, message) => {
	
	/** Check Playing State */
	const queue = bot.player.getQueue(message);
	if (!queue) {
		return simpleEmbed(message, 'There\'s nothing playing in the queue.');
	}

	/** Do the thing */
	try {
		const queue = await bot.player.shuffle(message),
		songs = queue.songs.map((song, index) => `**${index + 1}**: [${song.name}](${song.url}) - \`${song.formattedDuration}\``);
		return {
			title: 'Queue Order',
			color: 'BLUE',
			description: `The queue has been shuffled successfully.\nThe new order is shown below.\n\n${songs.join('\n')}`
		}
	} catch(error) {
		log('commandError', 'shuffle', error)
		return generateErrorEmbed(message, error);
	}
})