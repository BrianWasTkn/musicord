import { Context, CurrencyEntry } from 'lava/index';
import { ToolItem } from '../..';

export default class Tool extends ToolItem {
	constructor() {
		super('padlock', {
			assets: {
				name: 'Padlock',
				emoji: ':lock:',
				price: 3000,
				intro: 'Secure your coins!',
				info: 'Protect yourself from pesky robbers. Breaks away after some time.'
			},
			config: {
				push: true,
			},
		});
	}

	async use(ctx: Context, entry: CurrencyEntry) {
		const { parseTime, randomNumber } = ctx.client.util;
		const duration = 1000 * 60 * 60;
		const expire = Date.now() + duration;
		const won = randomNumber(100, 1000);

		await entry.addPocket(won).activateItem(this.id, expire).save();
		return ctx.reply({ embed: {
			description: `Your ${this.id} will automatically break in ${parseTime(duration / 1000)}`,
			color: 'YELLOW', author: { name: `You activated your ${this.name}!` },
			footer: { text: `Coin Bonus: ${won.toLocaleString()}` }
		}});
	}
}