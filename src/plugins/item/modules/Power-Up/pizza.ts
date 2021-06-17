import { Context, CurrencyEntry, ItemEffects } from 'lava/index';
import { PowerUpItem } from '../..';

export default class PowerUp extends PowerUpItem {
	constructor() {
		super('pizza', {
			name: 'TJ\'s Pizza',
			emoji: ':pizza:',
			price: 125000,
			checks: 'time',
			duration: 1000 * 60,
			shortInfo: 'Yummy experience orbs...',
			longInfo: 'Exp-erience the real meaning of grinding!',
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
