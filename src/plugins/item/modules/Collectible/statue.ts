import { CollectibleItem, Entity } from '../..';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('statue', {
			name: 'Fist Statue',
			emoji: ':fist:',
			price: 100e6,
				shortInfo: 'How tall can this statue get?',
				longInfo: 'More steal barriers, more multipliers, even your dice counts! Wow this item is epic.',
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