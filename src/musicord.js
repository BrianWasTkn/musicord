import Musicord from './classes/Musicord.js'
import config from './config/config.js'
import chalk from 'chalk'
import moment from 'moment'

/* Run */
const run = async () => {
	const Bot = new Musicord(
		config.clientOptions, config.playerOptions
	);

	/* Process Errors */
	try {
		process
		.on('unhandledRejection', error => {
			Bot.utils.log('Musicord', 'process', 'Unhandled Rejection', error.stack);
		})
		.on('uncaughtException', error => {
			Bot.utils.log('Musicord', 'process', 'Uncaught Exception', error.stack);
			process.exit(1);
		});
	} catch(error) {
		Bot.utils.log('Musicord', 'error', 'Process Listener', error);
		process.exit(1);
	}

	/* Log-in */
	try {
		if (config.token) {
			Bot.utils.log('Musicord', 'main', 'Logging in...');
			await Bot.login(config.token);
		}
	} catch(error) {
		Bot.utils.log('Musicord', 'error', 'login', error);
		process.exit(1);
	}
}

/* Run */
const timestamp = `[${moment().format('HH:mm:ss')}]`;
try {
	console.log(
		chalk.whiteBright(timestamp), 
		chalk.hex('#57d6ff')('Musicord'),
		chalk.whiteBright('=>'),
		chalk.greenBright('Launching Musicord...')
	);
	run();
} catch(error) {
	console.log(
		chalk.whiteBright(timestamp), 
		chalk.redBright('Musicord'),
		chalk.whiteBright('=>'),
		chalk.hex('#57d6ff')(error)
	);
	process.exit(1);
}
