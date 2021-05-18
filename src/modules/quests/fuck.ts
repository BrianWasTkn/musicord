import { Quest } from 'lib/objects';

export default class Easy extends Quest {
	constructor() {
		super('fuck', {
			rewards: { coins: 1e4, item: [50, 'thicm'] },
			target: [100000, 'sell', 'sellItem'],
			difficulty: 'Easy',
			info: 'Sell 100 pieces of any item type.',
			name: 'Fuck It',
		});
	}
}
