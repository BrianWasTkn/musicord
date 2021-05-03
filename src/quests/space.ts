import { Quest } from 'lib/objects';

export default class Hard extends Quest {
	constructor() {
	    super('space', {
			rewards: { coins: 3e5, item: [100, 'donut'] },
			target: [100e6, 'use', 'expandVault'],
			diff: 'Hard',
			info: 'Expand your vault capacity to 100,000,000 more.',
			name: 'Space It',
	    });
	}
}
