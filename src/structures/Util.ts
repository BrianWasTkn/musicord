import { LavaClient } from './LavaClient'
import chalk from 'chalk'
import moment from 'moment'

export class Util {
	public client: LavaClient;
	public constructor(client: LavaClient) {
		/**
		 * The Lava Client
		 * @type {LavaClient}
		*/
		this.client = client;
	}

	public random(type: string, entries: any[]): any {
		switch (type) {
			case 'num':
				const [max, min] = entries;
				return Math.floor(Math.random() * (max - min + 1) - min);
				break;
			case 'arr':
				return entries[Math.floor(Math.random() * entries?.length)];
				break;
		}
	}

	public log(struct: string, type: string, _: string, err?: Error): void {
		const stamp = moment().format('HH:mm:ss');
		switch (type) {
			case 'main':
				console.log(
					chalk.whiteBright(`[${stamp}]`), chalk.cyanBright(struct), 
					chalk.whiteBright('=>'), chalk.yellowBright(_)
				);
				break;
			case 'error':
				console.log(
					chalk.whiteBright(`[${stamp}]`), chalk.redBright(struct), 
					chalk.whiteBright('=>'), chalk.redBright(_), err
				);
				break;
			default:
				this.log(struct, 'main', _);
				break;
		}
	}
}