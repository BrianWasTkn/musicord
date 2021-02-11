import { Collection, Role, GuildChannel } from 'discord.js'
import { ClientUtil } from 'discord-akairo'
import chalk from 'chalk'
import moment from 'moment'

class Util extends ClientUtil implements Akairo.Util {
	public heists: Collection<GuildChannel["id"], Role>;
	public Colors: Lava.Colors;
	public constructor(public client: Akairo.Client) {
		super(client);

		this.heists = new Collection();
	}

	/**
	 * Divides the items of an array into arrays
	 * @param array An array with usually many items
	 * @param size The number of items per array in return
	 */
	public paginateArray(array: any[], size: number): Array<any[]> {
		let result = []; let j = 0;
		for (let i = 0; i < Math.ceil(array.length / (size || 5)); i++) {
			result.push(array.slice(j, j + (size || 5)));
			j = j + (size || 5);
		}
		return result;
	}

	/**
	 * Returns a random item from an array
	 * @param array An array of anything
	 */
	public randomInArray(array: any[]): any {
		return array[Math.floor(Math.random() * array.length)];
	}

	/**
	 * Generates a random number
	 * @param min The minimum number possible
	 * @param max The maximum number possible
	 */
	public randomNumber(min: number, max: number): any {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	/**
	 * Generates a random decimal color resolvable
	 */
	public randomColor(): number {
		return Math.random() * 0xffffff;
	}

	/**
	 * Logs something into the console
	 * @param struct The constructor name
	 * @param type Either `main` or `error`
	 * @param _ The message to be displayed
	 * @param err An error object
	 */
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

	public sleep(ms: number): Promise<number> {
		return new Promise((resolve: Function) => setTimeout(() => resolve(ms), ms));
	}
}

/**
 * Material Colors constant
 */
Util.prototype.Colors = require('./Constants').Colors;

export default Util;