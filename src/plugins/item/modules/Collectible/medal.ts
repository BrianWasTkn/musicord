import { CollectibleItem } from '../..';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('medal', {
			assets: {
				name: 'Gold Medal',
				emoji: ':medal:',
				price: 15e6,
				intro: 'Barriers and barriers...',
				info: 'Grants you a steal barrier to decrease coins being robbed from you!',
			},
			config: {
				push: true,
			},
			upgrades: [
				{ price: 25e6 }, 
				{ price: 30e6 }, 
				{ price: 45e6 },
				{ price: 60e6 },
				{ price: 100e6 }
			],
			entities: {
				shield: [5, 10, 15, 20, 30, 50]
			}
		});
	}
}