import { CollectibleItem } from '../..';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('ring', {
			assets: {
				name: 'Shiny Ring',
				emoji: ':ring:',
				price: 10e6,
				intro: 'Slots rig eh? You found your solution!',
				info: 'Grants you good amount of luck on slots and a flex against normies!',
			},
			upgrades: [
				{ price: 15e6 }, 
				{ price: 20e6 }, 
				{ price: 25e6 }
			],
			entities: {
				slots: [1, 2, 3, 5]
			}
		});
	}
}