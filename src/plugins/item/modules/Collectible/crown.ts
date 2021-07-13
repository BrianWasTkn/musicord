import { CollectibleItem } from '../..';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('crown', {
			assets: {
				name: 'Royal Crown',
				emoji: ':crown:',
				price: 50e6,
				intro: 'You\'re the VIP of this shop...',
				info: 'Wearing this crown gives you a certain percentage of discount whenever you buy something!',
			},
			config: {
				push: true,
			},
			upgrades: [
				{ price: 70e6 }, 
				{ price: 85e6 }, 
				{ price: 10e7 },
				{ price: 15e7 },
				{ price: 20e7 }
			],
			entities: {
				discount: [2, 4, 8, 10, 15, 20]
			}
		});
	}
}