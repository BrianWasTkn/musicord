import { Quest } from 'lib/handlers/quest';

export default class Medium extends Quest {
	constructor() {
	    super('hunt', {
			rewards: { coins: 5e4, item: [300, 'herb'] },
			target: [5e3, 'gift', 'shareItems'],
			diff: 'Medium',
			info: 'Gift 5,000 pieces of any item type to someone.',
			name: 'Gift It',
	    });
	}
}
