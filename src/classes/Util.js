import chalk from 'chalk'
import moment from 'moment'
import Discord from 'discord.js'

export default class Util {
	constructor(client) {
		this.client = client;
	}

	/**
	 * Logger
	 * @param {Object} Class the class logged
	 * @param {String} type the type of log
	 * * `warn` - a warning
	 * * `error` - an error
	 * * `process` - the node process
	 * * `console` - a normal log
	 * * `discord` - from discord
	 * * `manager` - a musicord manager
	 * * `command` - from a command
	 * @param {String} msg the message
	 * @param {Boolean|String|Object} error the error, if any
	 * @returns {void}
	*/
	log({ Class, type, tag, info = false }) {
		/* The base function */
		const log = (Class, tag, info = false) => {
			return console.log(
				chalk.whiteBright(`[${moment().format('HH:mm:ss')}]`),
				Class, tag, chalk.whiteBright('=>'), info || null
			);
		}

		/* The types of logging */
		switch(type) {
			case 'warn':
			return log(chalk.yellowBright(Class), chalk.whiteBright(tag));
			break;
			case 'error':
			return log(chalk.redBright(Class), chalk.yellowBright(tag), info);
			break;
			case 'process':
			return log(chalk.blueBright(Class), chalk.cyanBright(tag), info);
			break;
			case 'console':
			return log(chalk.hex('#57d6ff')(Class), chalk.greenBright(tag));
			break;
			case 'discord':
			return log(chalk.hex('#7289DA')(Class), chalk.hex('#7289DA')(tag), info);
			break;
			case 'manager':
			return log(chalk.magentaBright(Class), chalk.greenBright(tag));
			break;
			case 'command':
			return log(chalk.cyanBright(Class), chalk.greenBright(tag));
			break;
		}
	}

	/**
	 * Creates an "alt-embed"
	 * @param {Object} embed an obj that contains props
	 * @returns {Discord.MessageEmbed} the native embed obj
	 */
	dynamicEmbed({
		author = {}, fields = {}, footer = {},
		title = null, icon = null, text = null,
		color = 'RANDOM',
	} = {}) {
		return {
			embed: {
				author: { 
					name: author.text, 
					iconURL: author.icon 
				},
				title: title,
				thumbnail: icon,
				color: Colors[color],
				description: text,
				fields: Object.entries(fields).map(f => ({ 
					name: f[0], 
					value: f[1].content, 
					inline: f[1].inline || false 
				})),
				footer: { 
					text: footer.text, 
					iconURL: footer.icon 
				}
			}
		}
	}
}

/* Colors */
const Colors = {
	RED: 0xE74C3C, 
	ORANGE: 0xF39C12,
	YELLOW: 0xF1C40F,
	GREEN: 0x2ECC71,
	BLUE: 0x3498DB,
	PURPLE: 0x9932CC,
	GREY: 0x34495E,
	GRAY: this.GREY,
	BLURPLE: 0x7289DA,
	GREYPLE: 0x99AAB5
}