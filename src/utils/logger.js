/**
 * BrianWasTkn 2020
 * A module for fancy logging
*/

import chalk from 'chalk'
import moment from 'moment'

export const log = (type, content, error = null) => {
	const timestamp = moment().format("YYYY-MM-DD HH:mm:ss");
	const stamp = (tag, msg, error = false) => {
		console.log(
		`[${chalk.whiteBright(timestamp)}]:`,									// timestamp
		chalk.hex('#57d6ff')(tag),														// tag
		chalk.whiteBright('=>'),															// arrow
		error ? chalk.redBright(msg) : chalk.greenBright(msg)	// message
		)
	}

	switch(type) {
		case 'node':
			stamp('Process ', content);
			console.log(error);
			break;
		case 'main':
			stamp('Launcher', content);
			break;
		case 'track':
			stamp('Tracker ', content);
			break;
		case 'command':
			stamp('Command ', content);
			break;
		case 'discord':
			stamp('Discord ', content);
			break;
		case 'event':
			stamp('Emitter ', content);
			break;
		case 'error':
			stamp('Error   ', content, true);
			console.log(error)
			break;
		case 'eventError':
			stamp('EVTError', content, true);
			console.log(error)
			break;
		case 'commandError':
			stamp('CMDError', content, true);
			console.log(error)
			break;
		case 'listenerError':
			stamp('LNRError', content, true);
			console.log(error)
			break;
		default: 
			stamp('Console ', content);
			break;
	}
}