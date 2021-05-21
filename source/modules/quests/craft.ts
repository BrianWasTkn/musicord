import { Quest } from 'lib/objects';

export default class Difficult extends Quest {
	constructor() {
	    super('craft', {
			rewards: { coins: 1e5, item: [1000, 'pee'] },
			target: [10, 'craft', 'craftKeys'],
			difficulty: 'Difficult',
			info: 'Craft 10 keys.',
			name: 'Craft It',
	    });
	}
}
