import { CollectibleItem, Entity } from '../..';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('trophy', {
			name: 'Shiny Trophy',
			emoji: ':trophy:',
			price: 30e6,
			shortInfo: 'Embrace the powers of the almighty trophy!',
			longInfo: 'A good amount of gambling boost is good yeah?',
			upgrades: [
				{ price: 45e6 }, 
				{ price: 55e6 }, 
				{ price: 70e6 }
			],
			entities: {
				multipliers: [10, 12.5, 15, 20]
			}
		});
	}
}