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
				long: 'Embrace the almighty powers of the trident!',
				short: 'Increases your multipliers, shop discounts, steal shields and increase your gambling dice or just flex it against the poorest!'
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