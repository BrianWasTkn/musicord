import config from './config.js'
import Musicord from './classes/Client.js'

import { logInit, logError } from './utils/logger.js'

const run = async () => {
	try {
		/** Process Error: unhandledRejection */
		process.on('unhandledRejection', async (error) => {
			await logError('Process', 'unhandledRejection', error)
		})
		/** Process Error: uncaughtException */
		process.on('uncaughtException', async (error) => {
			await logError('Process', 'uncaughtException', error)
		})
	} catch(error) {
		await logError('Error(process)', 'process error handler', error)
		process.exit(1)
	}

	try {
		if (config.token) {
			await logInit('Musicord', 'Launching Musicord...')
			await musicord()
		}
	} catch(error) {
		await logError('Error(launch)', 'Invalid or Unknown Token', error)
		process.exit(1)
	}
}

const musicord = async () => {
	const bot = new Musicord(config.clientOpts, config.playerOpts);

	/** Login our bot */
	try {
		await logInit('Musicord', 'Waiting for login...')
		await bot.login(config.token);
	} catch(error) {
		await logError('Error(musicord)', 'Unable to login', error)
		process.exit(1)
	}

}

/** Run the whole bot */
try {
	run()
	logInit('Musicord', 'Bot initialized')
} catch(error) {
	logError('Error(main)', 'Bot failed to run', error)
}