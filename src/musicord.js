import config from './config.js'
import Musicord from './classes/Client.js'

import { logInit, logError } from './utils/logger.js'

const run = async () => {
	try {
		/** Process Error: unhandledRejection */
		process.on('unhandledRejection', async (error) => {
			logError('Process', 'unhandledRejection', error.stack)
		})
		/** Process Error: uncaughtException */
		process.on('uncaughtException', async (error) => {
			logError('Process', 'uncaughtException', error.stack)
		})
	} catch(error) {
		logError('Error', 'process error handler', error)
		process.exit(1)
	}

	try {
		if (config.token) {
			logInit('Musicord', 'Launching Musicord...')
			await musicord()
		}
	} catch(error) {
		logError('Error', 'Invalid or Unknown Token', error)
		process.exit(1)
	}
}

const musicord = async () => {
	const bot = new Musicord(config.clientOpts, config.playerOpts);

	/** Login our bot */
	try {
		logInit('Musicord', 'Waiting for login...')
		await bot.login(config.token);
	} catch(error) {
		logError('Error', 'Unable to login', error)
		process.exit(1)
	}

}

/** Run the whole bot */
try {
	run()
	logInit('Musicord', 'Bot initialized')
} catch(error) {
	logError('Error', 'Bot failed to run', error)
}