import { Context, CurrencyEntry } from 'lava/index';
import { ToolItem } from '../..';

export default class Tool extends ToolItem {
	constructor() {
		super('computer', {
			name: 'Prob\'s Computer',
			emoji: ':computer:',
			price: 4000,
			shortInfo: 'An item from a redditor.',
			longInfo: 'Post specific type of memes on reddit!'
		});
	}

	async exec(ctx: Context, entry: CurrencyEntry) {
		
	}
}