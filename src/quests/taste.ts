import { Quest } from 'lib/handlers/quest';

export default class Difficult extends Quest {
	constructor() {
	    super('taste', {
			rewards: { coins: 5e5, item: [100000, 'pee'] },
			target: [10, ['buy', 'donut'], 'buyItem'],
			diff: 'Difficult',
			info: 'Buy 10 Donut Rings.',
			name: 'Taste It',
	    });
	}
}
