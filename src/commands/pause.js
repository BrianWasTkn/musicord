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
	try {
		const queue = bot.player.getQueue(message);
		if (!queue) {
			return simpleEmbed({
				title: 'Player Empty',
				color: 'RED',
				text: 'There\'s nothing playing in the queue.'
			})
		}
	} catch(error) {
		log('error', 'pause@checkQueue', error.stack);
		return errorEmbed({ title: 'pause@checkQueue', error: error });
	}

	/** Check if Paused */
	try {
		const paused = bot.player.isPaused(message);
		if (paused) {
			return simpleEmbed({
				title: 'Already Paused',
				color: 'RED',
				text: 'The player is already paused.'
			})
		}
	} catch(error) {
		log('error', 'voteskip@checkPaused', error.stack);
		return errorEmbed({ title: 'voteskip@checkPaused', error: error });
	}

	/** Else, pause */
	try {
		const queue = await bot.player.pause(message);
		return dynamicEmbed({
			title: 'Player Paused',
			color: 'BLUE',
			text: 'The player is now paused.',
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