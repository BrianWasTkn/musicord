import { Context, CurrencyEntry, ItemEffects } from 'lava/index';
import { PowerUpItem } from '../..';

export default class PowerUp extends PowerUpItem {
	constructor() {
		super('cheese', {
			assets: {
				name: 'Luca\'s Cheese',
				emoji: ':cheese:',
				price: 10000,
				intro: 'Lactose for bits?',
				info: 'Give yourself some bits of xp boost!',
			},
			config: {
				push: true
			},
			upgrades: [
				{ price: 15000 },
				{ price: 25000 },
				{ price: 50000 },
			]
		});
	}

	effect(effects: ItemEffects, entry: CurrencyEntry) {
		return effects.xpBoost(10);
	}

	async use(ctx: Context, entry: CurrencyEntry) {
		
	}
}
