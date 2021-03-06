import { CollectibleItem } from '../..';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('trident', {
			assets: {
				name: 'Neptune\'s Trident',
				emoji: ':trident:',
				price: 80e6,
				intro: 'Ready for ultimate grinding?',
				info: 'Grants you a great amount of XP boost NO ONE could ever get!',
			},
			config: {
				push: true,
			},
			upgrades: [
				{ price: 100e6 }, 
				{ price: 120e6 }, 
				{ price: 150e6 },
				{ price: 200e6 },
				{ price: 250e6 }
			],
			entities: {
				xpBoost: [10, 20, 30, 40, 50, 100]
			}
		});
	}
}