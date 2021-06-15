import { CollectibleItem, Entity } from '../..';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('crown', {
			info: {
				buy: 50e6,
				emoji: ':crown:',
				name: 'Royal Crown',
				sell: 0,
			},
			description: {
				long: 'Only the richest of the richest can own this!',
				short: 'Does nothing at the moment, coming soon!'
			},
			upgrades: [
				{ price: 70e6 }, 
				{ price: 85e6 }, 
				{ price: 10e7 }
			]
		});
	}

	get entity(): Entity {
		return {
			multipliers: [10, 15, 20, 30],
		};
	}
}