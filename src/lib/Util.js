const { 
	Collection,
	MessageCollector 
} = require('discord.js');
const { 
	ClientUtil 
} = require('discord-akairo');
const chalk = require('chalk');
const moment = require('moment');

module.exports = class Util extends ClientUtil {
	constructor(client) {
		super(client);
		this.crib = {
			heists: new Collection()
		}
	}

	static coreLogger(struct = '', content = '', error = '') {
		const stamp = moment().format('HH:mm:ss');
		console.log(
			chalk.whiteBright(`[${stamp}]`),
			struct, chalk.whiteBright('=>'),
			content, error || ''
		);
	}

	async awaitMessage(channel, user, timeout) {
		const filter = m => m.author.id === user.id;
		const collector = new MessageCollector(channel, filter, { time: timeout });
		collector.on('end', async collected => {
			return collected.first();
		});
	}

	random(type, entry) {
		switch(type) {
			case 'arr': 
				return entry[Math.floor(Math.random() * entry.length)];
				break;
			case 'num':
				const { min, max } = entry;
				return Math.floor(Math.random() * (max - min + 1) + min);
				break;
			default:
				return this.random(Array.isArray(entry) ? 'arr' : 'num', entry);
				break;
		}
	}

	log(struct, type, content, error = false) {	
		switch(type) {
			case 'main': 
				this.constructor.coreLogger(chalk.cyanBright(struct), chalk.yellowBright(content));
				break;
			case 'error': 
				this.constructor.coreLogger(chalk.redBright(struct), chalk.redBright(content), chalk.whiteBright(error));
				break;
		}
	}
}