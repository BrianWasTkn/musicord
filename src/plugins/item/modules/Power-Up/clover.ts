import { Context, CurrencyEntry, ItemEffects } from 'lava/index';
import { PowerUpItem } from '../..';

export default class PowerUp extends PowerUpItem {
	constructor() {
		super('clover', {
			assets: {
				name: 'Clover',
				emoji: ':four_leaf_clover:',
				price: 65000,
				intro: 'Good luck!',
				info: 'Grant yourself a good amount of luck in gamble, beg and slots. No one knows how lucky you are!',
			},
			config: {
				duration: 1000 * 60 * 60,
			},
			upgrades: [
				{ price: 69000, duration: 1000 * 60 * 60 * 3 },
				{ price: 75000, duration: 1000 * 60 * 60 * 5 },
				{ price: 90000, duration: 1000 * 60 * 60 * 10 },
			]
		});
	}

	effect(effects: ItemEffects, entry: CurrencyEntry) {
		return effects.setLuck('def', 10);
	}

	async exec(ctx: Context, entry: CurrencyEntry) {
		
	}
}
