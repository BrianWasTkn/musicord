import { log } from '../utils/logger.js'

export async function run(bot) {
	try {
		bot
		.on('ready', () => logInit('Discord', `${bot.user.tag} is now ready to play some beats!`))
		.on('warn', (info) => logError('Discord', 'A warning emitted by Discord', info))
		.on('error', (error) => logError('Discord', 'An error emitted by Discord', error))
		.on('rateLimit', (rateLimit) => logError('Discord', 'Rate Limit warning', rateLimit))

		log('main', 'Discord Event Emitter')
	} catch(error) {
		log('listenerError', 'discordEventEmitter', error)
	}
}