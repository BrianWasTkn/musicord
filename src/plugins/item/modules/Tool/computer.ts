import { Context, CurrencyEntry } from 'lava/index';
import { ToolItem } from '../..';

export default class Tool extends ToolItem {
	constructor() {
		super('computer', {
			assets: {
				name: 'Prob\'s Computer',
				emoji: ':computer:',
				price: 4000,
				intro: 'An item from a redditor.',
				info: 'Post specific type of memes on reddit!'
			}
		});
	}

	async exec(ctx: Context, entry: CurrencyEntry) {
		
	}
}