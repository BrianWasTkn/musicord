import { Context, CurrencyEntry, ItemEffects } from 'lava/index';
import { PowerUpItem } from '../..';

export default class PowerUp extends PowerUpItem {
	constructor() {
		super('taco', {
			assets: {
				name: 'Crazy Dave\'s Taco',
				emoji: ':taco:',
				price: 25000,
				intro: 'More gambling shinanigans.',
				info: 'Multis multis and multis for few hours!',
			},
			config: {
				duration: 1000 * 60,
			},
			upgrades: [
				{ price: 3000, duration: 1000 * 60 * 60 * 3 },
				{ price: 5000, duration: 1000 * 60 * 60 * 5 },
				{ price: 10000, duration: 1000 * 60 *  60 * 10 },
			]
		});
	}

	effect(effects: ItemEffects, entry: CurrencyEntry) {
		return effects.setMulti(15);
	}

	async exec(ctx: Context, entry: CurrencyEntry) {
		
	}
}
