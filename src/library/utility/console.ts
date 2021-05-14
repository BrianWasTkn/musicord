/**
 * Im tired of this fuckery but here it goes, log bullshit fancily.
 * @author BrianWasTired
*/

import moment from 'moment';
import chalk from 'chalk';

const log = (...args: any[]) => console.log(...args);

export class Console {
	public chalk: typeof chalk = chalk;
	public stamp = () => moment().format('HH:mm:ss');

	public log(tag: string, msg: string) {
		log(this.chalk.cyanBright(`[${this.stamp()} => ${tag}] ${msg}`));
	}

	public error(tag: string, error: Error, stack = false) {
		log(this.chalk.redBright(`[${this.stamp()} => ${tag}] ${error.message}`));
		if (stack) log(this.chalk.whiteBright(error.stack));
	}

	public debug(tag: string, msg: string) {
		log(this.chalk.whiteBright(`[${this.stamp()} => ${tag}] ${msg}`));
	}
}

export default Console;