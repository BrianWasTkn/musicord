import { CollectibleItem, Entity } from '../..';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('gem', {
			name: 'Crystal Gem',
			emoji: ':gem:',
			price: 5e6,
			shortInfo: 'A little gambling boost and that\'s fine yeah?',
			longInfo: 'Gives you a boost in your gambling payouts for more ching ching :money_mouth:',
			upgrades: [
				{ price: 8e6 }, 
				{ price: 11e6 }, 
				{ price: 15e6 }
			],
			entities: {
				multipliers: [2, 2.5, 3.5, 5]
			}
		});
	}
}