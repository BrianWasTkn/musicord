import Musicord from './classes/Musicord.js'
import config from './config/config.js'

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
		Bot.login(config.token);
	}
} catch(error) {
	Bot.utils.log('Musicord', 'error', 'login', error);
	process.exit(1);
}