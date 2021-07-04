import { Context, CurrencyEntry } from 'lava/index';
import { ToolItem } from '../..';

export default class Tool extends ToolItem {
	constructor() {
		super('phone', {
			assets: {
				name: 'Smort Phone',
				emoji: ':mobile_phone:',
				price: 6000,
				intro: 'High-tech phone for bastards!',
				info: 'Contact anyone using your phone, anywhere!'
			},
			config: {
				push: true,
			},
		});
	}

	async use(ctx: Context, entry: CurrencyEntry) {
		return ctx.reply('Your phone is currently off.'); // Prompt `y / n` for 1000 coins to turn it on.
	}
}