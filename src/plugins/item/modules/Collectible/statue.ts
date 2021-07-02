import { CollectibleItem } from '../..';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('statue', {
			assets: {
				name: 'Fist Statue',
				emoji: ':fist:',
				price: 100e6,
				intro: 'How tall can YOUR statue get?',
				info: 'More steal barriers, more multipliers, even your dice counts! THIS ITEM IS EVERYTHING!',
			},
			config: {
				push: true,
			},
			upgrades: [
				{ price: 150e6 }, 
				{ price: 250e6 }, 
				{ price: 500e6 }
			],
			entities: {
				multipliers: [10, 20, 30, 40],
				shield: [10, 15, 30, 50],
				dice: [1, 1, 1, 2]
			}
		});
	}
}