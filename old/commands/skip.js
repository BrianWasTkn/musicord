import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'
import { 
	simpleEmbed,
	dynamicEmbed, 
	errorEmbed 
} from '../utils/embed.js'

export default new Command({
	name: 'skip',
	aliases: ['playnext', 's'],
	description: 'skip the current track',
	usage: 'command'
}, async (bot, message) => {
	
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

		/** Do the thing */
		try {
			await bot.player.skip(message);
			return dynamicEmbed({
				title: 'Track Skipped',
				color: 'GREEN',
				text: 'The previous track has been successfully skipped.',
				fields: {
					'Action By': { content: message.author.tag }
				},
				footer: {
					text: `Thanks for using ${bot.user.username}!`,
					icon: bot.user.avatarURL()
				}
			});
		} catch(error) {
			log('commandError', 'skip@main_command', error)
			return errorEmbed({ title: 'skip@main_command', error: error });
		}
	} catch(error) {
		log('error', 'skip@checkQueue', error.stack);
		return errorEmbed({ title: 'skip@checkQueue', error: error });
	}

})