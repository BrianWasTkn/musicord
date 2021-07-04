import { Context, CurrencyEntry, ItemEffects } from 'lava/index';
import { PowerUpItem } from '../..';

export default class PowerUp extends PowerUpItem {
	constructor() {
		super('wine', {
			assets: {
				name: 'Brian\'s Wine',
				emoji: ':wine_glass:',
				price: 35000,
				intro: 'Simply hack into your dice...',
				info: 'Drink for temporary dice hax!',
			},
			config: {
				duration: 1000 * 60 * 60 * 10,
				push: true
			},
			upgrades: [
				{ price: 37500, duration: 1000 * 60 * 60 * 15 },
				{ price: 42000, duration: 1000 * 60 * 60 * 30 },
				{ price: 50000, duration: 1000 * 60 * 60 * 45 },
			]
		});
	}

	effect(effects: ItemEffects, entry: CurrencyEntry) {
		return effects.setLuck('dice', 1);
	}

	async use(ctx: Context, entry: CurrencyEntry) {
		
	}
}
