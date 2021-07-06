import { Context, CurrencyEntry, ItemEffects } from 'lava/index';
import { PowerUpItem } from '../..';

export default class PowerUp extends PowerUpItem {
	constructor() {
		super('bacon', {
			assets: {
				name: 'Bacon',
				emoji: ':bacon:',
				price: 1000,
				intro: 'More ching chings!',
				info: 'Eat it for temporary multipliers',
			},
			config: {
				duration: 1000 * 60 * 60 * 5,
				push: true
			},
			upgrades: [
				{ price: 3000, duration: 1000 * 60 * 60 * 10 },
				{ price: 7000, duration: 1000 * 60 * 60 * 20 },
				{ price: 10000, duration: 1000 * 60 * 60 * 45 },
			]
		});
	}

	effect(effects: ItemEffects, entry: CurrencyEntry) {
		return effects.multi(entry.props.items.get(this.id).multiplier);
	}

	async use(ctx: Context, entry: CurrencyEntry) {
		
	}
}
