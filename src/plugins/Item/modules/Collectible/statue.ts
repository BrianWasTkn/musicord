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
				long: 'Embrace the powers of this statue!',
				short: 'Increases your multipliers or just flex it against the poorest!'
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
			multipliers: [10, 15, 20, 30],
		};
	}
}