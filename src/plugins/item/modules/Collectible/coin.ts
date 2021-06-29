import { CollectibleItem, Entity } from '../..';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('coin', {
			name: 'Shiny Coin',
			emoji: ':coin:',
			price: 2e6,
			shortInfo: 'A valuable coin from gods of the past.',
			longInfo: 'More ching ching in gambling, they say.',
			upgrades: [
				{ price: 2e6 }, 
				{ price: 3e6 }, 
				{ price: 8e6 }
			],
			entities: {
				payouts: [5, 6, 8, 10]
			}
		});
	}
}