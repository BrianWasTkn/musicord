import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'
import findLyrics from 'lyrics-finder'
import { 
	simpleEmbed, 
	errorEmbed 
} from '../utils/embed.js'

export default new Command({
	name: 'lyrics',
	aliases: ['ly'],
	description: 'View the lyrics of the current track.',
	usage: '[...songName]',
	cooldown: 5e3
}, async (bot, message, args) => {
	
	/** Check Playing State */
	const queue = bot.player.getQueue(message);
	if (!queue) {
		return simpleEmbed(message, 'There\'s nothing playing in the queue.');
	}

	try {
		const queue = bot.player.getQueue(message);
		try {
			// fetch
			let lyrics = await findLyrics(' ', queue.songs[0].name);

			// nothin' found
			if (!lyrics) {
				return simpleEmbed(message, 'No lyrics found for the song.');
			}

			// lyrics length
			if (lyrics.length > 2000) {
				lyrics = lyrics.substr(0, 2000);
			}

			// embed
			const embed = simpleEmbed(message, `Lyrics for: ${queue.songs[0].name}`);
			embed.color = 'BLUE';
			embed.description = lyrics;
			return embed;
		} catch(error) {
			log('commandError', 'lyrics@findLyrics', error.stack);
			return errorEmbed(message, error);
		}
	} catch(error) {
		log('commandError', 'lyrics@getQueue', error.stack);
		return errorEmbed(message, error);
	}

})