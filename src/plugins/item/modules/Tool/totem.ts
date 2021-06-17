import { Context, CurrencyEntry } from 'lava/index';
import { ToolItem } from '../..';

export default class Tool extends ToolItem {
	constructor() {
		super('totem', {
			name: 'Totem of Hearts',
			emoji: ':credit_card:',
			price: 10000,
			shortInfo: 'They say this item gives you nine lives and up...',
			longInfo: 'Equip to not die and lose any cluster of your progress!'
		});
	}

	async exec(ctx: Context, entry: CurrencyEntry) {
		
	}
}