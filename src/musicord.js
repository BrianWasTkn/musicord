import config from './config.js'
import Musicord from './classes/Client.js'

import { log } from './utils/logger.js'

export const musicord = async () => {
	const bot = new Musicord(config.clientOpts, config.playerOpts);

	/** Login our bot */
	try {
		log('main', 'Logging In...')
		await bot.login(config.token);
	} catch(error) {
		log('error', 'Unable to login.', error)
		process.exit(1);
	}

}