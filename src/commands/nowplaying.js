import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'

export default new Command({
	name: 'nowplaiyng',
	aliases: ['np'],
	description: 'View the current track playing in the queue.',
	usage: 'command'
}, async (bot, message) => {
	
	/** Check Playing State */
	const isPlaying = bot.player.isPlaying(message);
	if (!isPlaying) {
		return 'There\'s nothing playing in the queue.'
	}	

	/** Do the thing */
	try {
		const queue = bot.player.getQueue(message);
		if (!queue) return 'No song playing.';
		return {
			title: `${queue.songs[0].name}`,
			color: 'BLUE',
			fields: [
				{ name: 'Duration', value: queue.songs[0].formattedDuration, inline: true },
				{ name: 'Link', value: `[Click Here](${queue.songs[0].url})`, inline: true }
			]
		}
	} catch(error) {
		log('commandError', 'loop', error)
		return error;
	}
})