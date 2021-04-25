import { Quest } from 'lib/handlers/quest';

export default class Easy extends Quest {
	constructor() {
		super('fuck', {
			rewards: { coins: 1e4, item: [15, 'thicm'] },
			target: [10, 'sell', 'sellItem'],
			diff: 'Easy',
			info: 'Sell 100 pieces of any item type.',
			name: 'Fuck It',
		});
	}
}
