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
	 * * `console` - a normal log
	 * * `process` - the node process
	 * * `discord` - from discord
	 * * `manager` - a musicord manager
	 * * `command` - from a command
	 * @param {String} msg the message
	 * @param {Boolean|String|Object} error the error, if any
	 * @returns {void}
	*/
	log({ Class, type, msg, error = false }) {
		/* The base function */
		const log = (Class, msg, error = false) => {
			return console.log(
				`[${moment().format('HH:mm:ss')}]`,
				chalk.hex('#57d6ff')(Class),
				chalk.greenBright(msg),
				error || null
			)
		}

		/* The types of logging */
		switch(type) {
			case 'warn':
			return log(Class, tag, msg);
			break;
			case 'error':
			return log(Class, tag, msg, error);
			break;
			case 'console':
			return log(Class, tag, msg);
			break;
			case 'process':
			return log(Class, tag, msg);
			break;
			case 'discord':
			return log(Class, tag, msg);
			break;
			case 'manager':
			return log(Class, tag, msg);
			break;
			case 'command':
			return log(Class, tag, msg);
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
				color: color,
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