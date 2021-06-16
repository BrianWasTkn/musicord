import { CollectibleItem, Entity } from '../..';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('crown', {
			name: 'Royal Crown',
			emoji: ':crown:',
			price: 50e6,
			shortInfo: 'They say you\'re a VIP of this shop...',
			longInfo: 'Wearing this crown gives you a certain percentage of discount whenever you buy something!',
			upgrades: [
				{ price: 70e6 }, 
				{ price: 85e6 }, 
				{ price: 10e7 }
			],
			entities: {
				discount: [1, 3, 5, 10]
			}
		});
	}
}