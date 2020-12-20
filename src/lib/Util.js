const { ClientUtil } = require('discord-akairo');
const chalk = require('chalk');
const moment = require('moment');

module.exports = class Util extends ClientUtil {
	constructor(client) {
		super(client);
	}

	_log(struct = '', content = '', error = '') {
		const stamp = moment().format('HH:mm:ss');
		console.log(
			chalk.whiteBright(`[${stamp}]`),
			struct, chalk.whiteBright('=>'),
			content, error || ''
		);
	}

	log(
		struct = this.client.constructor.name,
		type = 'main', content = '', error = false
	) {	

		switch(type) {
			case 'main': 
				this._log(chalk.cyanBright(struct), chalk.yellowBright(content));
				break;
			case 'error': 
				this._log(chalk.redBright(struct), chalk.redBright(content), chalk.whiteBright(error));
				break;
		}
	}
}