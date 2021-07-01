import { Context, CurrencyEntry, ItemEffects } from 'lava/index';
import { PowerUpItem } from '../..';

export default class PowerUp extends PowerUpItem {
	constructor() {
		super('pizza', {
			assets: {
				name: 'TJ\'s Pizza',
				emoji: ':pizza:',
				price: 125000,
				intro: 'Yummy experience orbs...',
				info: 'Exp-erience the real meaning of grinding!',
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
		return effects.setXPBoost(5);
	}

	async exec(ctx: Context, entry: CurrencyEntry) {
		
	}
}
