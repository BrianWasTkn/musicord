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
	const queue = bot.player.getQueue(message);
	if (!queue) {
		return simpleEmbed(message, 'There\'s nothing playing in the queue.');
	}

	/** Do the thing */
	try {
		await bot.player.stop(message);
		return dynamicEmbed({
			title: 'Player Stopped',
			color: 'RED',
			info: `The player has been stopped and the queue has been cleared.`,
			fields: {
				'Action By': { content: message.author.tag }
			},
			footer: {
				text: `Thanks for using ${bot.user.username}!`,
				icon: bot.user.avatarURL()
			}
		});
	} catch(error) {
		log('commandError', 'stop', error)
		return errorEmbed(message, error);
	}
})