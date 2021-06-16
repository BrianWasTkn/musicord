import { Context, CurrencyEntry, ItemEffects } from 'lava/index';
import { PowerUpItem } from '../..';

export default class extends PowerUpItem {
	constructor() {
		super('beer', {
			name: 'Crazy\'s Beer',
			emoji: ':beers:',
			price: 2000,
			checks: 'time',
			duration: 1000 * 60,
			shortInfo: 'Slots rig eh? One time solution!',
			longInfo: 'Drink for temporarily high jackpots on slots!',
			upgrades: [
				{ price: 3000, duration: 1000 * 60 * 3 },
				{ price: 5000, duration: 1000 * 60 * 5 },
				{ price: 10000, duration: 1000 * 60 * 10 },
			]
		});
	}

	effect(effects: ItemEffects, entry: CurrencyEntry) {
		return effects.setLuck('slots', 5);
	}

	async exec(ctx: Context, entry: CurrencyEntry) {
		
	}
}
