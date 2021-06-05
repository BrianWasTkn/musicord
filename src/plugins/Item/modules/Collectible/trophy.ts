import { CollectibleItem, Entity } from 'plugins/item';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('trophy', {
			info: {
				buy: 50e6,
				emoji: ':trophy:',
				name: 'Trophy',
				sell: 0,
			},
			description: {
				long: 'Embrace the powers of this trophy!',
				short: 'Increases your multipliers or just flex it against the poorest!'
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