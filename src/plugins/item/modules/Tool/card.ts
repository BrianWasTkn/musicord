import { Context, CurrencyEntry } from 'lava/index';
import { ToolItem } from '../..';

export default class Tool extends ToolItem {
	constructor() {
		super('card', {
			name: 'Porche\'s Card',
			emoji: ':credit_card:',
			price: 15000,
			shortInfo: 'Do you lack of coin space?',
			longInfo: 'Gives you 2000-5000 coins of expanded storage!'
		});
	}

	async exec(ctx: Context, entry: CurrencyEntry) {
		
	}
}