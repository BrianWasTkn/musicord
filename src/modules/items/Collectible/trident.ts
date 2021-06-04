import { CollectibleItem } from 'lava/index';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('trident', {
			info: {
				emoji: ':trident:',
				name: 'Trident',
				buy: 100e6,
			},
			description: {
				long: 'Embrace the almighty powers of the trident!',
				short: 'Gives off a 20% multi, 50% xp boost and 3% steal shields with no upgrades and all perks go up as you upgrade it or could just be a massive flex against the poorest of the poors!'
			},
			upgrades: [
				{ name: 'Mars\' Trident', price: 150e6 }, 
				{ name: 'Saturn\'s Trident', price: 250e6 }, 
				{ name: 'Neptune\'s Trident', price: 500e6 }
			]
		});
	}
}