import Musicord from './classes/Musicord.js'
import config from './config/config.js'
import chalk from 'chalk'
import moment from 'moment'

const { client_options, player_options, token } = config;
const Bot = new Musicord(client_options, player_options);

const login = async () => {
	try {
		if (token) {
			Bot.utils.log('Musicord', 'main', 'Logging in...');
			await Bot.login(token);
		} else {
			Bot.utils.log('Musicord', 'error', 'Discord Token Required', new Error('DISCORD_TOKEN_EMPTY'));
			process.exit(1);
		}
	} 
}

try {
	Bot.utils.log('Musicord', 'main', 'Launching Bot...');
	login();
} catch(error) {
	Bot.utils.log('Musicord', 'error', 'Unable to launch bot.', error);
	process.exit(1);
}
