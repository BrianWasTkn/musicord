import { Quest } from 'lib/objects';

export default class Easy extends Quest {
	constructor() {
		super('fuck', {
			rewards: { coins: 1e4, item: [15, 'thicm'] },
			target: [100, 'sell', 'sellItem'],
			diff: 'Easy',
			info: 'Sell 100 pieces of any item type.',
			name: 'Fuck It',
		});
	}
}
