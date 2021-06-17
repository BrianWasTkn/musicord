import { Context, CurrencyEntry, ItemEffects } from 'lava/index';
import { PowerUpItem } from '../..';

export default class PowerUp extends PowerUpItem {
	constructor() {
		super('donut', {
			name: 'Bob\'s Donut',
			emoji: ':doughnut:',
			price: 30000,
			checks: 'time',
			duration: 1000 * 60,
			shortInfo: 'Coin madness!',
			longInfo: 'Temporarily increase coin payouts for all coin gaining commands!',
			upgrades: [
				{ price: 3000, duration: 1000 * 60 * 3 },
				{ price: 5000, duration: 1000 * 60 * 5 },
				{ price: 10000, duration: 1000 * 60 * 10 },
			]
		});
	}

	effect(effects: ItemEffects, entry: CurrencyEntry) {
		return effects.setPayouts(10);
	}

	async exec(ctx: Context, entry: CurrencyEntry) {
		
	}
}
