import chalk from 'chalk'
import moment from 'moment'

export class Util {
	constructor(client) {
		this.client = client;
	}

	log(
		struct = this.client.constructor.name,
		type = 'main', content = '', error = false
	) {
		const log = (struct = '', content = '', error = false) => {
			const stamp = moment().format('HH:mm:ss');
			console.log(
				chalk.whiteBright(`[${stamp}]`),
				struct, chalk.whiteBright('=>'),
				content, error || ''
			);
		}

		switch(type) {
			case 'main': 
				log(chalk.cyanBright(struct), chalk.yellowBright(content));
				break;
			case 'error': 
				log(chalk.redBright(struct), chalk.redBright(content), chalk.whiteBright(error));
				break;
		}
	}
}