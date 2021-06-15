import { CollectibleItem, Entity } from '../..';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('ring', {
			info: {
				buy: 10e6,
				emoji: ':ring:',
				name: 'Shiny Ring',
				sell: 0,
			},
			description: {
				long: 'They say this ring came from the gods of volcanos...',
				short: 'Increases padlock protection!' // idea: increase some item powerups/protection
			},
			upgrades: [
				{ price: 15e6 }, 
				{ price: 20e6 }, 
				{ price: 25e6 }
			]
		});
	}

	get entity(): Entity {
		return {
			multipliers: [10, 15, 20, 30],
		};
	}
}