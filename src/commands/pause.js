import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'
import { 
	simpleEmbed, 
	generateError 
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
		return {
			author: {
				name: 'Player Paused',
				iconURL: bot.user.avatarURL
			},
			color: 'BLUE',
			description: `${message.author.tag} successfully paused the queue.`
		}
	} catch(error) {
		log('commandError', 'pause@pause', error.stack);
		return generateError(message, error);
	}
})