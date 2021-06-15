import { CollectibleItem, Entity } from '../..';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('trident', {
			info: {
				buy: 80e6,
				emoji: ':trident:',
				name: 'Neptune\'s Trident',
				sell: 0,
			},
			description: {
				long: 'Give yourself some barriers against pesky robbers!',
				short: 'Give yourself a permanent steal shield! Does not stack but if you lose this, your steal shield will be taken away from you.'
			},
			upgrades: [
				{ price: 100e6 }, 
				{ price: 120e6 }, 
				{ price: 150e6 }
			]
		});
	}

	get entity(): Entity {
		return {
			multipliers: [3, 5, 10, 15],
			discount: [3, 5, 10, 15],
			shield: [3, 5, 10, 15],
			dice: [1, 1, 1, 2],
		};
	}
}