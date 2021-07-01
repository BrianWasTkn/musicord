import { Context, CurrencyEntry, ItemEffects } from 'lava/index';
import { PowerUpItem } from '../..';

export default class PowerUp extends PowerUpItem {
	constructor() {
		super('donut', {
			assets: {
				name: 'Bob\'s Donut',
				emoji: ':doughnut:',
				price: 30000,
				intro: 'Coin madness!',
				info: 'Temporarily increase coin payouts for all coin gaining commands!',	
			},
			config: {
				duration: 1000 * 60,
			},
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
