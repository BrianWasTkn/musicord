import { Context, CurrencyEntry, ItemEffects } from 'lava/index';
import { PowerUpItem } from '../..';

export default class PowerUp extends PowerUpItem {
	constructor() {
		super('alcohol', {
			assets: {
				name: 'Alcohol',
				emoji: ':beer:',
				price: 20000,
				intro: 'Toxic luck?',
				info: 'Grant yourself either a bad, good or great amount of luck in gamble and robbing!',
			},
			config: {
				duration: 1000 * 60 * 60 * 60 * 12,
			},
			upgrades: [
				{ price: 40000, duration: 1000 * 60 * 60 * 60 * 16 },
				{ price: 80000, duration: 1000 * 60 * 60 * 60 * 24 },
				{ price: 120000, duration: 1000 * 60 * 60 * 60 * 36 },
			]
		});
	}

	effect(effects: ItemEffects, entry: CurrencyEntry) {
		return effects.setMulti(entry.items.get(this.id).multiplier); // multi for luck between 0 and 100
	}

	async exec(ctx: Context, entry: CurrencyEntry) {
		
	}
}