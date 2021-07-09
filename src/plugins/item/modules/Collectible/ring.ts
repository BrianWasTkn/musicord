import { CollectibleItem } from '../..';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('ring', {
			assets: {
				name: 'Fabled Ring',
				emoji: ':ring:',
				price: 10e6,
				intro: 'A lucky charm?',
				info: 'Grants you good amount of luck on coin gaining commands!',
			},
			config: {
				push: true,
			},
			upgrades: [
				{ price: 15e6 }, 
				{ price: 20e6 }, 
				{ price: 25e6 }
			],
			entities: {
				luck: [1, 3, 5, 10]
			}
		});
	}
}