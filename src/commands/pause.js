import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'
import { 
	simpleEmbed,
	dynamicEmbed, 
	errorEmbed 
} from '../utils/embed.js'

export default new Command({
	name: 'pause',
	aliases: ['freeze'],
	description: 'pause the current playing track',
	usage: 'command'
}, async (bot, message, args) => {

	/** Check Playing State */
	const queue = bot.player.getQueue(message);
	if (!queue) {
		return simpleEmbed(message, 'There\'s nothing playing in the queue.');
	}

	/** Check if paused */
	const paused = bot.player.isPaused(message);
	if (paused) {
		return simpleEmbed(message, 'The player is already paused.');
	}

	/** Else, pause */
	try {
		const queue = await bot.player.pause(message);
		return dynamicEmbed({
			title: 'Player Paused',
			color: 'BLUE',
			info: 'The player is now paused.',
			fields: {
				'Action by': { content: message.author.tag }
			},
			footer: {
				text: `Thanks for using ${bot.user.username}!`,
				icon: bot.user.avatarURL()
			}
		})
	} catch(error) {
		log('commandError', 'pause@pause', error.stack);
		return errorEmbed(message, error);
	}
})