import { CollectibleItem } from '../..';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('medal', {
			assets: {
				name: 'Medal of Honor',
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
				{ price: 45e6 }
			],
			entities: {
				shield: [5, 8, 12, 20]
			}
		});
	}
}