import { Context, CurrencyEntry } from 'lava/index';
import { PowerUpItem } from '../..';

export default class extends PowerUpItem {
	constructor() {
		super('wine', {
			name: 'Brian\'s Wine',
			emoji: ':wine:',
			price: 2000,
			checks: 'time',
			duration: 1000 * 60,
			shortInfo: 'Simply hack into your dice...',
			longInfo: 'Drink for temporary dice hax!',
			upgrades: [
				{ price: 3000, duration: 1000 * 60 * 3 },
				{ price: 5000, duration: 1000 * 60 * 5 },
				{ price: 10000, duration: 1000 * 60 * 10 },
			]
		});
	}

	async exec(ctx: Context, entry: CurrencyEntry) {
		
	}
}
