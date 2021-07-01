import { CollectibleItem } from '../..';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('coin', {
			assets: {
				name: 'Shiny Coin',
				emoji: ':coin:',
				price: 2e6,
				intro: 'A valuable coin from gods of the past.',
				info: 'More ching ching in gambling, they say'
			},
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