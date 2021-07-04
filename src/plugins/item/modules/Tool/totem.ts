import { Context, CurrencyEntry } from 'lava/index';
import { ToolItem } from '../..';

export default class Tool extends ToolItem {
	constructor() {
		super('totem', {
			assets: {
				name: 'Totem of Hearts',
				emoji: ':heart:',
				price: 10000,
				intro: 'They say this item gives you a chance to dodge death...',
				info: 'Equip to prevent dying and not lose any cluster of your progress!'
			},
			config: {
				push: true,
			},
		});
	}

	async exec(ctx: Context, entry: CurrencyEntry) {
		const { parseTime, randomNumber } = ctx.client.util;
		const duration = 1000 * 60 * 60;
		const expire = Date.now() + duration;
		const won = randomNumber(100, 1000);

		await entry.addPocket(won).activateItem(this.id, expire).save();
		return ctx.reply({ embed: {
			description: `Your ${this.id} will stop beating in ${parseTime(duration / 1000)}`,
			color: 'FUCHSIA', author: { name: `You activated your ${this.name}!` },
			footer: { text: `Coin Bonus: ${won.toLocaleString()}` }
		}});
	}
}