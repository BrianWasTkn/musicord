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
				{ price: 500e6 }
			],
			entities: {
				multipliers: [10, 20, 30, 40],
				xpBoost: [100, 150, 250, 500],
				shield: [10, 15, 30, 50],
			}
		});
	}
}