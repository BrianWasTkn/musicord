import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'
import { 
	simpleEmbed,
	dynamicEmbed,
	errorEmbed 
} from '../utils/embed.js'

export default new Command({
	name: 'stop',
	aliases: ['shutup'],
	description: 'stop the queue',
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
			await bot.player.stop(message);
			return dynamicEmbed({
				title: 'Player Stopped',
				color: 'GREEN',
				text: `The player has been stopped and the queue has been cleared.`,
				fields: {
					'Action By': { content: message.author.tag }
				},
				footer: {
					text: `Thanks for using ${bot.user.username}!`,
					icon: bot.user.avatarURL()
				}
			});
		} catch(error) {
			log('commandError', 'stop@main_command', error)
			return errorEmbed({ title: 'stop@main_command', error: error });
		}
	} catch(error) {
		log('error', 'stop@checkQueue', error.stack);
		return errorEmbed({ title: 'stop@checkQueue', error: error });
	}

})