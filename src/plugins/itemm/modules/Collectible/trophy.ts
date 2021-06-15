import { CollectibleItem, Entity } from '../..';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('trophy', {
			info: {
				buy: 30e6,
				emoji: ':trophy:',
				name: 'Shiny Trophy',
				sell: 0,
			},
			description: {
				long: 'Embrace the powers of this trophy!',
				short: 'Increases your multipliers by 10% (does not stack) or just flex it against the poorest!'
			},
			upgrades: [
				{ price: 45e6 }, 
				{ price: 55e6 }, 
				{ price: 70e6 }
			]
		});
	}

	get entity(): Entity {
		return {
			multipliers: [10, 15, 20, 30],
		};
	}
}