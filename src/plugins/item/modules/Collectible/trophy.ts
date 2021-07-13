import { CollectibleItem } from '../..';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('trophy', {
			assets: {
				name: 'Lava Trophy',
				emoji: ':trophy:',
				price: 30e6,
				intro: 'Embrace the powers of the almighty trophy!',
				info: 'A great amount of gambling multiplier boost!',
			},
			config: {
				push: true,
			},
			upgrades: [
				{ price: 45e6 }, 
				{ price: 55e6 }, 
				{ price: 70e6 },
				{ price: 100e6 },
				{ price: 150e6 }
			],
			entities: {
				multipliers: [15, 30, 45, 60, 75, 90]
			}
		});
	}
}