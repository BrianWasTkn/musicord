import { log } from './utils/logger.js'
import { musicord } from './musicord.js'
import config from './config.js'

const run = async () => {
	try {
		/** Process Error: unhandledRejection */
		process.on('unhandledRejection', error => {
			log('node', 'unhandledRejection', error.stack);
		})
		/** Process Error: uncaughtException */
		process.on('uncaughtException', error => {
			log('node', 'uncaughtException', error.stack);
		})
	} catch(error) {
		log('error', 'Cannot instantiate process error listeners.', error);
		process.exit(1)
	}

	try {
		if (config.token) {
			log('main', 'Launching Musicord...');
			await musicord();
		}
	} catch(error) {
		log('error', 'Cannot load the musicord() function.', error);
		process.exit(1);
	}
}

/** Run the whole bot */
try {
	run()
} catch(error) {
	log('error', 'Unable to launch musicord.', error)
}