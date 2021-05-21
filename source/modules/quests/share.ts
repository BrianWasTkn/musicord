import { Quest } from 'lib/objects';

export default class Easy extends Quest {
	constructor() {
	    super('fish',{
			rewards: { coins: 5e5, item: [1650, 'computer'] },
			target: [100e6, 'give', 'shareCoins'],
			difficulty: 'Easy',
			info: 'Share 100,000,000 coins to someone.',
			name: 'Share It',
	    });
	}
}
