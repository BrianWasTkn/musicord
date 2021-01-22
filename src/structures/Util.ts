import { ClientUtil } from 'discord-akairo'
import Lava from 'discord-akairo'
import chalk from 'chalk'
import moment from 'moment'

export class Utils extends ClientUtil implements Lava.Utils {
	public client: Lava.Client;
	public constructor(client: Lava.Client) {
		super(client);
	}

	public static paginateArray(array: any[], size: number): (string[])[] {
		let result = [];
    let j = 0;
    for (let i = 0; i < Math.ceil(array.length / (size || 10)); i++) {
      result.push(array.slice(j, j + (size || 10)));
      j = j + (size || 10);
    }
    return result;
	}

	public static random(type: Lava.RandomType, entries: any[]): any {
		switch (type) {
			case 'num':
				const [min, max] = entries;
				return Math.floor(Math.random() * (max - min + 1) + min);
				break;
			case 'arr':
				return entries[Math.floor(Math.random() * entries.length)];
				break;
		}
	}

	public static log(struct: string, type: string, _: string, err?: Error): void {
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

	public async sleep(ms): Promise<number> {
		return new Promise((resolve: Function) => {
			setTimeout(() => {
				resolve(ms);
			}, ms)
		});
	}
}