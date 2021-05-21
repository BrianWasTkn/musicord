import { CollectibleItem } from 'rw/library';

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
				buy: 50000000,
				sell: 0,
				emoji: ':trophy:'
			},
			description: {
				long: 'owa owa',
				short: 'owa'
			},
			upgrades: [{
				emoji: ':trophy:',
				price: 100e6,
				level: 1,
				name: 'Trophy',
			}]
		});
	}
}