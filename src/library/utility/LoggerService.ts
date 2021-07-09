/**
 * Our small logger service for fancy logging owo. 
 * @author BrianWasTaken
*/

import moment from 'moment';
import chalk from 'chalk';

/**
 * Log bs into your console.
 */
const log = (...args: Parameters<Console['log']>) => console.log(...args);
/**
 * Create a stamp.
 */
const stamp = () => moment().format('HH:mm:ss');

export class Logger {
	public static createInstance() {
		return new this();
	}

	/**
	 * Log things normal by default.
	 */
	public log(tag: string, msg: string) {
		log(chalk.cyanBright(`[${stamp()} => ${tag}] ${msg}`));
	}

	/**
	 * Log an error.
	 */
	public error(tag: string, error: Error, stack = false) {
		log(chalk.redBright(`[${stamp()} => ${tag}] ${error.message}`));
		if (stack) log(chalk.whiteBright(error.stack));
	}

	/**
	 * Debug bs into your console.
	 */
	public debug(tag: string, msg: string) {
		log(chalk.whiteBright(`[${stamp()} => ${tag}] ${msg}`));
	}
}