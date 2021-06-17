import { Context, CurrencyEntry } from 'lava/index';
import { ToolItem } from '../..';

export default class Tool extends ToolItem {
	constructor() {
		super('padlock', {
			name: 'Padlock',
			emoji: ':lock:',
			price: 3000,
			shortInfo: 'Secure your coins!',
			longInfo: 'Protect yourself from pesky robbers.'
		});
	}

	async exec(ctx: Context, entry: CurrencyEntry) {
		
	}
}