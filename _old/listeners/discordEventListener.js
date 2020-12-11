import { log } from '../utils/logger.js'

export async function run(bot) {
	try {
		bot
		.on('ready', () => log('discord', `${bot.user.tag} is now ready to play some beats!`))
		.on('warn', info => log('discord', 'A warning emitted by Discord', info))
		.on('error', error => log('discord', 'An error emitted by Discord', error))
		.on('rateLimit', rateLimit => log('discord', 'Rate Limit warning', rateLimit))

		log('main', 'Discord Event Emitter')
	} catch(error) {
		log('listenerError', 'discordEventEmitter', error)
	}
}