import { CollectibleItem, Entity } from '../..';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('statue', {
			info: {
				buy: 100e6,
				emoji: ':moai:',
				name: 'Rock Statue',
				sell: 0,
			},
			description: {
				long: 'How tall can your statue get?',
				short: 'The number of items you own this item represents a metric feet and a metric feet gives off 1% multi!'
			},
			upgrades: [
				{ price: 150e6 }, 
				{ price: 250e6 }, 
				{ price: 500e6 }
			]
		});
	}

	get entity(): Entity {
		return {
			multipliers: [1, 2, 3, 5],
		};
	}
}