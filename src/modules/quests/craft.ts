import { Quest } from 'lib/objects';

export default class Difficult extends Quest {
	constructor() {
	    super('craft', {
			rewards: { coins: 5e5, item: [100000, 'pee'] },
			target: [50, 'craft', 'craftKeys'],
			difficulty: 'Difficult',
			info: 'Craft 50 keys.',
			name: 'Craft It',
	    });
	}
}
