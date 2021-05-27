import { CollectibleItem } from 'src/library';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('trophy', {
			info: {
				emoji: ':trophy:',
				name: 'Trophy',
				buy: 50000000,
			},
			description: {
				long: 'Empower your gamble winnings!',
				short: 'Gives off a 5% multi with no upgrades, and slightly goes up as you upgrade it or could just be a flex against poor people!'
			},
			upgrades: [
				{ name: 'Bronze Trophy', price: 70e6 }, 
				{ name: 'Silver Trophy', price: 85e6 }, 
				{ name: 'Golden Trophy', price: 10e7 }
			]
		});
	}
}