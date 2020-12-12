const moment = require('moment');
const chalk = require('chalk');

module.exports = class Util {
	constructor(client) {
		Object.defineProperty(this, 'client', { 
			value: client, 
			writable: false 
		});
	}

	log(structure, type, msg, error = false) {
		const log = (structure, msg, error) => {
			let timestamp = moment().format('HH:mm:ss');
			return console.log(
				chalk.whiteBright(timestamp), structure,
				chalk.whiteBright('=>'),
				msg, error || ''
			);
		}

		switch(type) {
			case 'main': 
			return log(chalk.hex('#98bff5')(structure), chalk.hex('#98bff5')(msg));
			break;

			case 'process': 
			return log(chalk.blueBright(structure), chalk.yellowBright(msg));
			break;

			case 'error': 
			return log(chalk.redBright(structure), chalk.redBright(msg));
			break;
		}
	}
}