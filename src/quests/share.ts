import { Quest } from 'lib/objects';

export default class Easy extends Quest {
	constructor() {
	    super('fish',{
			rewards: { coins: 5e4, item: [500, 'computer'] },
			target: [100e6, 'give', 'shareCoins'],
			difficulty: 'Easy',
			info: 'Share 100,000,000 coins to someone.',
			name: 'Share It',
	    });
	}
}
