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
	 * * `error` - an error
	 * * `process` - the node process
	 * * `main` - a general log
	 * @param {String} msg the message
	 * @param {Boolean|String|Object} error the error, if any
	 * @returns {void}
	*/
	log(Class, type, msg, info = false) {
		/* The base function */
		const log = (Class, msg, info = false) => {
			return console.log(
				chalk.whiteBright(`[${moment().format('HH:mm:ss')}]`),
				Class, chalk.whiteBright('=>'), msg, info || ''
			); // [00:00:00] Class => Some Message
		}

		/* The types of logging */
		switch(type) {
			// Red(Class) => Yellow(msg)
			case 'error':
			return log(chalk.redBright(Class), chalk.yellowBright(msg), info);
			break;

			// Blue(Class) => Cyan(msg)
			case 'process':
			return log(chalk.blueBright(Class), chalk.cyanBright(msg), info);
			break;

			// Hex(Class) => Green(msg)
			case 'main':
			return log(chalk.hex('#57d6ff')(Class), chalk.greenBright(msg));
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
				color: Colors[color] || Discord.Constants.Colors[color],
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

	/**
	 * Duration Formatter
	 * @param {number} ms the ms to format
	 * @returns {String} in 'hh:mm:ss' format
	 */
	formatDuration(ms) {
		/* Invalid or Empty */
		if (!ms || !parseInt(ms)) {
			return '00:00';
		}
		/* A func to convert "0:1" to "0:01" */
		const format = int => {
			if (int < 10) {
				return `0${int}`;
			} else {
				return int;
			}
		}
		/* Pre-vars */
		const hours = moment.duration(ms).hours();
		const minut = moment.duration(ms).minutes();
		const secon = moment.duration(ms).seconds();
		/* Check */
		if (hours > 0) {
			return [hours, minut, secon].map(i => format(i)).join(':');
		} else if (minut > 0) {
			return [minut, secon].map(i => format(i)).join(':');
		} else if (secon > 0) {
			return ['00', secon].map(i => format(i)).join(':');
		} else {
			return '00:00';
		}
	}

	/**
	 * Duration Formatter
	 * @param {String} stamp in 'hh:mm:ss' format
	 * @returns {number} in (ms / 1000)
	 */
	formatToSecond(stamp) {
		/* Check */
		if (!stamp) return;
		/* Pre-vars */
		let h = 0, m = 0, s = 0;
		if (stamp.match(':')) {
			let times = stamp.split(':');
			/* Minutes */
			if (times.length === 2) {
				m = parseInt(times[0], 10);
				s = parseInt(times[1], 10);
			}
			/* Hours */
			if (times.length === 3) {
				h = parseInt(times[0], 10);
				m = parseInt(times[1], 10);
				s = parseInt(times[2], 10);
			}
		} else {
			/* Seconds */
			s = parseInt(stamp, 10);
		}
		/* Return parsed seconds */
		return h * 60 * 60 + m * 60 + s;
	}

	/**
	 * Cooldown Formatter
	 * @param {number} ms the amount of time in seconds
	 * @returns {String} parsed cooldown string
	 */
	formatCooldown(s) {
		/* String and Time amount to use */
		const times = [
			{ name: 'day', value: 60 * 60 * 24 },
			{ name: 'hour', value: 60 * 60 },
			{ name: 'minute', value: 60 },
			{ name: 'second', value: 1 }
		]

		/* Maths */
		const calc = (s, index, modulus = true) => {
			return modulus 
			? Math.floor(s % times[index].value) 
				: Math.floor(s / times[index].value);
		}

		/* Formatting Time */
		const results = [ `${calc(s, 0, false).toString()} ${times[0].name}` ];
		for (let i = 0 ; i < 3 ; i++) {
			const formula = Math.floor(s % times[i].value / times[i + 1].value);
			const label = formula > 1 ? `${times[i + 1].name}s` : times[i + 1].name;
			results.push(`${formula.toString()} ${label}`)
		}

		/* Return */
		return results.filter(r => !r.startsWith('0')).join(', ');
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