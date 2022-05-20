import { Quest } from 'lib/objects';

export default class Easy extends Quest {
	constructor() {
		super('fuck', {
			rewards: { coins: 100000, item: [10, 'thicm'] },
			target: [10000, 'sell', 'sellItem'],
			difficulty: 'Easy',
			info: 'Sell 10,000 pieces of any item type.',
			name: 'Fuck It',
		});
	}
}
