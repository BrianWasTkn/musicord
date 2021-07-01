import { Context, CurrencyEntry, ItemEffects } from 'lava/index';
import { PowerUpItem } from '../..';

export default class PowerUp extends PowerUpItem {
	constructor() {
		super('wine', {
			assets: {
				name: 'Brian\'s Wine',
				emoji: ':wine_glass:',
				price: 65000,
				intro: 'Simply hack into your dice...',
				info: 'Drink for temporary dice hax!',
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
		return effects.setLuck('dice', 1);
	}

	async exec(ctx: Context, entry: CurrencyEntry) {
		
	}
}
