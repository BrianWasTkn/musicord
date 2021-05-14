import { Item } from 'lib/objects';

export default class Flex extends Item {
	constructor() {
		super('herb', {
			category: 'Flex',
			sellable: false,
			buyable: false,
			usable: false,
			emoji: ':herb:',
			name: "Ken's Herbal Supplement",
			cost: 50e6,
			tier: 3,
			info: {
				short: 'Just a flex from the man himself.',
				long: 'Have this item to fix his fucking self.',
			},
		});
	}
}
