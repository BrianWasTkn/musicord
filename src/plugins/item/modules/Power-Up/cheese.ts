import { Context, CurrencyEntry, ItemEffects } from 'lava/index';
import { PowerUpItem } from '../..';

export default class PowerUp extends PowerUpItem {
	constructor() {
		super('cheese', {
			assets: {
				name: 'Luca\'s Cheese',
				emoji: ':cheese:',
				price: 45000,
				intro: 'Increase your lactose by eating cheese!',
				info: 'Have a temporary chance of dropping keys and grab them? Wow okay.',
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
		return effects.setLuck('keyDrop', 10);
	}

	async exec(ctx: Context, entry: CurrencyEntry) {
		
	}
}
