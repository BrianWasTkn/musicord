import { CollectibleItem, Entity } from '../..';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('ring', {
			name: 'Shiny Ring',
			emoji: ':ring:',
			price: 10e6,
			shortInfo: 'Slots rig eh? This is your solution!',
			longInfo: 'Grants you good amount of luck on slots and a flex against normies!',
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