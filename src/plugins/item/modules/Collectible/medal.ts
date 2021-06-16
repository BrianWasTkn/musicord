import { CollectibleItem, Entity } from '../..';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('medal', {
			name: 'Medal of Honor',
			emoji: ':medal:',
			price: 15e6,
			shortInfo: 'Honorable item for honorable people!',
			longInfo: 'Grants you a steal barrier to decrease coins being robbed from you!',
			upgrades: [
				{ price: 25e6 }, 
				{ price: 30e6 }, 
				{ price: 45e6 }
			],
			entities: {
				shield: [5, 8, 12, 20]
			}
		});
	}
}