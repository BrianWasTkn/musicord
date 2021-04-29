import moment from 'moment';
import chalk from 'chalk';

const log = (...args: any[]) => console.log(...args);

export class Console {
	stamp: () => string;
	c: typeof chalk;

	constructor() {
		this.stamp = () => moment().format('HH:mm:ss');
		this.c = chalk;
	}

	log(tag: string, msg: string) {
		log(this.c.cyanBright(`[${this.stamp()} => ${tag}] ${msg}`));
	}

	error(tag: string, error: Error) {
		log(this.c.redBright(`[${this.stamp()} => ${tag}] ${error.message}`));
		log(this.c.whiteBright(error.stack));
	}

	debug(tag: string, msg: string) {
		log(this.c.whiteBright(`[${this.stamp()} => ${tag}] ${msg}`));
	}
}