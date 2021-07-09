import { CollectibleItem } from '../..';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('coin', {
			assets: {
				name: 'Lava Coin',
				emoji: ':coin:',
				price: 2e6,
				intro: 'Chings, Chings and Chings.',
				info: 'Increased payouts on multiplier-based gamble commands!'
			},
			config: {
				push: true,
			},
			upgrades: [
				{ price: 2e6 }, 
				{ price: 3e6 }, 
				{ price: 8e6 }
			],
			entities: {
				payouts: [5, 10, 25, 50]
			}
		});
	}
}