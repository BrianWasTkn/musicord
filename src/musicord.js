import config from './config.js'
import Musicord from './classes/Client.js'

import { logInit, logError } from './utils/logger.js'

const bot = new Musicord(config.clientOpts, config.playerOpts);

process.on('unhandledRejection', async (error) => {
	await logError('Main', 'unhandledRejection', error)
})
/** Process Error: uncaughtException */
process.on('uncaughtException', async (error) => {
	await logError('Main', 'uncaughtException', error)
})

bot.login(config.token);
