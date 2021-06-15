import { CollectibleItem, Entity } from '../..';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('coin', {
			info: {
				buy: 2e6,
				emoji: ':coin:',
				name: 'Shiny Coin',
				sell: 0,
			},
			description: {
				long: 'A coin from the past...',
				short: 'Gives you more payouts on gamble commands! Does not stack.'
			},
			upgrades: [
				{ price: 2e6 }, 
				{ price: 3e6 }, 
				{ price: 8e6 }
			]
		});
	}

	get entity(): Entity {
		return {
			multipliers: [10, 15, 20, 30],
		};
	}
}