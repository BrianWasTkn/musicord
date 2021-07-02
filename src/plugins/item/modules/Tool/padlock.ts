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
				info: 'Protect yourself from pesky robbers.'
			},
			config: {
				push: true,
			},
		});
	}

	async exec(ctx: Context, entry: CurrencyEntry) {
		
	}
}