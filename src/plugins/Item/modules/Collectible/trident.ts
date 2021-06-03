import { CollectibleItem, Entity } from 'plugins/item';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('trident', {
			info: {
				buy: 100e6,
				emoji: ':trident:',
				name: 'Trident',
				sell: 0,
			},
			description: {
				long: 'Embrace the almighty powers of the trident!',
				short: 'Increases your multipliers, shop discounts, steal shields and increase your gambling dice or just flex it against the poorest!'
			},
			upgrades: [
				{ name: 'Trident', price: 150e6 }, 
				{ name: 'Trident', price: 250e6 }, 
				{ name: 'Neptune\'s Trident', price: 500e6 }
			]
		});
	}

	get entity(): Entity {
		return {
			multipliers: [3, 5, 10, 15],
			discount: [3, 5, 10, 15],
			shield: [3, 5, 10, 15],
			dice: [1, 1, 1, 3],
		};
	}
}