import Command from '../classes/Command.js'
import { log } from '../utils/logger.js'

export default new Command({
	name: 'play',
	aliases: ['p'],
	description: 'play a song from soundcloud, youtube or from spotify and other sources.',
	usage: '<...query: any | playlistURL: any | videoURL: any>',
	cooldown: 5e3,
	music: true
}, async (bot, message, args) => {

	/** Missing Args (Bug?) */
	if (!args) {
		const error = bot.utils.fancyText(bot.emotes.error, 'Missing Args', 'You need something to play.')
		return error
	}

	/** Play */
	try {
		await bot.player.play(message, args.join(' '))
	} catch(error) {
		log('commandError', 'play', error)
		return error;
	}
})