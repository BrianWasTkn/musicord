import { CollectibleItem } from 'src/library';

export default class Collectible extends CollectibleItem {
	public constructor() {
		super('trophy', {
			name: 'Trophy',
			config: {
				showInInventory: true,
				showInShop: true,
				sellable: false,
				premium: false,
				retired: false,
				buyable: true,
				usable: false
			},
			info: {
				buyPrice: 50000000,
				sellPrice: 0,
				emoji: ':trophy:'
			},
			description: {
				long: 'Power your gamble winnings!',
				short: 'Gives off a 5% multi with no upgrades, and slightly goes up as you upgrade it or else, it can be a flex against poor sons of a bitch!'
			},
			upgrades: [{
				emoji: ':trophy:',
				price: 75e6,
				level: 1,
				name: 'Trophy',
			}, {
				emoji: ':trophy:',
				price: 85e6,
				level: 2,
				name: 'Trophy'
			}, {
				emoji: ':trophy:',
				price: 100e6,
				level: 3,
				name: 'Trophy'
			}]
		});
	}
}