import { Quest } from 'lib/objects';

export default class Hard extends Quest {
	constructor() {
	    super('space', {
			rewards: { coins: 200e6, item: [15000, 'porsche'] },
			target: [100e6, 'use', 'expandVault'],
			difficulty: 'Hard',
			info: 'Expand your vault capacity to 100,000,000 more.',
			name: 'Space It',
	    });
	}
}
