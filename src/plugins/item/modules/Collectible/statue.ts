import { CollectibleItem } from '../..';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('statue', {
			assets: {
				name: 'Brofist Statue',
				emoji: ':fist:',
				price: 100e6,
				intro: 'How tall can YOUR statue get?',
				info: 'A shitload of xp boosts, multipliers and steal shields. Congrats if you own this item.',
			},
			config: {
				push: true,
			},
			upgrades: [
				{ price: 150e6 }, 
				{ price: 250e6 }, 
				{ price: 500e6 },
				{ price: 1000e6 },
				{ price: 1500e6 }
			],
			entities: {
				multipliers: [15, 30, 45, 60, 75, 100],
				xpBoost: [5, 10, 15, 20, 300, 50],
				shield: [5, 10, 15, 20, 30, 50],
			}
		});
	}
}