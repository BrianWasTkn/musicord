import { Context, CurrencyEntry } from 'lava/index';
import { ToolItem } from '../..';

export default class Tool extends ToolItem {
	constructor() {
		super('totem', {
			name: 'Totem of Hearts',
			emoji: ':heart:',
			price: 10000,
			shortInfo: 'They say this item gives you a chance to dodge death...',
			longInfo: 'Equip to prevent dying and not lose any cluster of your progress!'
		});
	}

	async exec(ctx: Context, entry: CurrencyEntry) {
		
	}
}