import { ClientUtil } from 'discord-akairo'
import { LavaClient } from './LavaClient'
import chalk from 'chalk'

export class Util extends ClientUtil {
	public constructor(client: LavaClient) {
		super(client);
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

	public console(struct: string, type: string, _: string, err?: Error): void {
		switch (type) {
			case 'main':
				console.log(
					chalk.cyanBright(struct), chalk.whiteBright('=>'), chalk.yellowBright(_)
				);
				break;
			case 'error':
				console.log(
					chalk.redBright(struct), chalk.whiteBright('=>'), chalk.redBright(_), err
				);
			break;
			default:
				this.console(struct, 'main', _);
				break;
		}
	}
}