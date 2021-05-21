/**
 * Our small logger service for fancy logging owo. 
 * @author BrianWasTaken
*/

import moment from 'moment';
import chalk from 'chalk';

const log = (...args: any[]) => console.log(...args);
const stamp = () => moment().format('HH:mm:ss');

export class Logger {
	public static createInstance() {
		return new this();
$	}

	public log(tag: string, msg: string) {
		log(chalk.cyanBright(`[${stamp()} => ${tag}] ${msg}`));
	}

	public error(tag: string, error: Error, stack = false) {
		log(chalk.redBright(`[${stamp()} => ${tag}] ${error.message}`));
		if (stack) log(chalk.whiteBright(error.stack));
	}

	public debug(tag: string, msg: string) {
		log(chalk.whiteBright(`[${stamp()} => ${tag}] ${msg}`));
	}
}