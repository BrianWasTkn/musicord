import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'
import { 
	simpleEmbed,
	dynamicEmbed,
	errorEmbed 
} from '../utils/embed.js'

export default new Command({
	name: 'resume',
	aliases: ['unfreeze'],
	description: 'resume playing the current queue',
	usage: 'command'
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

		/** Check if Paused */
		try {
			const paused = bot.player.isPaused(message);
			if (!paused) {
				return simpleEmbed({
					title: 'Not Paused',
					color: 'RED',
					text: 'The player is not paused.'
				})
			}
		} catch(error) {
			log('error', 'resume@checkPaused', error.stack);
			return errorEmbed({ title: 'resume@checkPaused', error: error });
		}

		/** Else, resume */
		try {
			await bot.player.resume(message);
			return dynamicEmbed({
				title: 'Player Resumed',
				color: 'BLUE',
				text: 'The player has resumed playing the tracks.',
				fields: {
					'Action by': { content: message.author.tag }
				},
				footer: {
					text: `Thanks for using ${bot.user.username}!`,
					icon: bot.user.avatarURL()
				}
			});
		} catch(error) {
			log('commandError', 'resume@main_command', error)
			return errorEmbed({ title: 'resume@main_command', error: error });
		}
	} catch(error) {
		log('error', 'resume@checkQueue', error.stack);
		return errorEmbed({ title: 'resume@checkQueue', error: error });
	}

})