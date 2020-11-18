import Command from '../classes/Command.js'
import { log } from '../utils/logger.js'
import findLyrics from 'lyrics-finder'

export default new Command({
	name: 'lyrics',
	aliases: ['l'],
	description: 'view the lyrics of the current track.',
	usage: '[...songName: String]',
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
			if (!lyrics) lyrics = 'No lyrics found.'
			if (lyrics.split('').length > 1000) {
				lyrics = `${lyrics.substr(0, 1000)}...`
			}
			/** Message */
			return {
				title: `Lyrics for **${queue.songs[0].name}**`,
				color: 'BLUE',
				description: lyrics
			}
		} catch(error) {
			log('commandError', 'lyrics@findLyrics', error.stack)
			return error;
		}
	} catch(error) {
		log('commandError', 'lyrics@getQueue', error.stack)
		return error;
	}

})