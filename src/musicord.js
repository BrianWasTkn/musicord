import { logInit, logError } from './utils/logger.js'
import Musicord from './classes/Client.js'

const config = require('./config.js').default;

export const run = async() => {
	try {
		/** Process Error: unhandledRejection */
		process.on('unhandledRejection', async (error) => {
			await logError('Main', 'unhandledRejection', error)
		})
		/** Process Error: uncaughtException */
		process.on('uncaughtException', async (error) => {
			await logError('Main', 'uncaughtException', error)
		})
	} catch(error) {
		await logError('Main', 'process error handler', error)
		process.exit(1)
	}

	try {
		if (config.token) {
			await logInit('Main', 'Launching Musicord...')
			await musicord()
		}
	} catch(error) {
		await logError('Main', 'invalid or unknown token', error)
		process.exit(1)
	}
}

const musicord = async () => {
	const bot = new Musicord(config.clientOpts, config.playerOpts);

	/** Login our bot */
	try {
		await logInit('Main', 'Waiting for login...')
		await bot.login(config.token);
	} catch(error) {
		await logError('Main', 'unable to login', error)
		process.exit(1)
	}

}

/** Run the whole bot */
try {
	run()
	logInit('Main', 'Bot initialized')
} catch(error) {
	logError('Main', 'Bot failed to run', error)
}