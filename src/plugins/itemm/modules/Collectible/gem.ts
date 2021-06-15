import { CollectibleItem, Entity } from '../..';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('gem', {
			info: {
				buy: 5e6,
				emoji: ':gem:',
				name: 'Crystal Gem',
				sell: 0,
			},
			description: {
				long: 'Crystal clear gem from the past...',
				short: 'Increase your luck on some commands!'
			},
			upgrades: [
				{ price: 8e6 }, 
				{ price: 11e6 }, 
				{ price: 15e6 }
			]
		});
	}

	get entity(): Entity {
		return {
			multipliers: [10, 15, 20, 30],
		};
	}
}