import { log } from './utils/logger.js'
import Musicord from './classes/Musicord.js'
import config from './config/config.js'

const login = async () => {
	const bot = new Musicord(
		config.clientOptions, config.playerOptions
);

	/** Login our bot */
	try {
		log('main', 'Logging In...');
		await bot.login(config.token);
	} catch(error) {
		log('error', 'Unable to login.', error);
		process.exit(1);
	}
}

const run = async () => {
	try {
		/** Process Error: unhandledRejection */
		/** Process Error: uncaughtException */
		process.on('unhandledRejection', error => {
			log('node', 'unhandledRejection', error.stack);
		}).on('uncaughtException', error => {
			log('node', 'uncaughtException', error.stack);
			process.exit(1);
		});
	} catch(error) {
		log('error', 'Cannot instantiate process error listeners.', error);
		process.exit(1);
	}

	try {
		if (config.token) {
			log('main', 'Launching Musicord...');
			await login();
		}
	} catch(error) {
		log('error', 'Cannot load the musicord() function.', error);
		process.exit(1);
	}
}

/** Run the whole bot */
try {
	run();
} catch(error) {
	log('error', 'Unable to launch musicord.', error);
}