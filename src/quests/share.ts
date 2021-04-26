import { Quest } from 'lib/handlers/quest';

export default class Easy extends Quest {
	constructor() {
	    super('fish',{
			rewards: { coins: 5e4, item: [500, 'computer'] },
			target: [100e6, 'give', 'shareCoins'],
			diff: 'Easy',
			info: 'Share 100,000,000 coins to someone.',
			name: 'Share It',
	    });
	}
}
