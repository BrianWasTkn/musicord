import Command from '../classes/Command.js'
import { logError } from '../utils/logger.js'
import findLyrics from 'lyrics-finder'

export default new Command({
	name: 'lyrics',
	aliases: ['l'],
	description: 'view the lyrics of the current track.',
	usage: '[...songName]',
	cooldown: 5e3,
	music: true
}, async (bot, message, args) => {
	
	/** Check Playing State */
	const isPlaying = bot.player.isPlaying(message);
	if (!isPlaying) {
		return 'There\'s nothing playing in the queue.'
	}

	/** First Phase */
	try {
		const queue = bot.player.getQueue(message);
		/** Request Lyrics */
		try {
			let lyrics = await findLyrics("", queue.songs[0].name);
			if (lyrics.split('').length > 1000) {
				lyrics = lyrics.split(' ').slice(0, 1000).join('')
			}
			/** Message */
			return {
				title: `Lyrics for **${queue.songs[0].name}**`,
				description: lyrics;
			}
		} catch(error) {
			logError('Command', 'Unable to request lyrics', error.stack)
		}
	} catch(error) {
		logError('Command', 'Unable to get queue', error.stack)
	}

})