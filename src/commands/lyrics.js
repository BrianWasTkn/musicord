import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'
import findLyrics from 'lyrics-finder'
import { 
	simpleEmbed,
	dynamicEmbed, 
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
	try {
		const queue = bot.player.getQueue(message);
		if (!queue) {
			return simpleEmbed({
				title: 'Player Empty',
				color: 'RED',
				text: 'There\'s nothing playing in the queue.'
			})
		}
		
		/** Do the Thing */
		try {
			const lyrics = await findLyrics(' ', queue.songs[0].name);
			if (!lyrics) {
				return simpleEmbed({
					title: 'Nothing Found',
					color: 'RED',
					text: `No lyrics found for **${queue.songs[0].name}**.`
				});
			} else {
				return dynamicEmbed({
					title: `${queue.songs[0].name} — Lyrics`,
					color: 'BLUE',
					text: lyrics,
					footer: {
						text: `Thanks for using ${bot.user.username}!`,
						icon: bot.user.avatarURL()
					}
				});
			}
		} catch(error) {
			log('commandError', 'lyrics@main_command', error.stack);
			return errorEmbed({ title: 'lyrics@main_command', error: error });
		}
	} catch(error) {
		log('error', 'lyrics@checkQueue', error.stack);
		return errorEmbed({ title: 'lyrics@checkQueue', error: error });
	}


})