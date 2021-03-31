import { Quest } from '@lib/handlers/quest';

export default class Difficult extends Quest {
	constructor() {
		super('buy', {
			diff: 'Difficult',
			info: 'Buy 100 each of 5 different items.',
			name: 'Buy It',
		}, {
			coins: 5e5,
			item: [50, 'crazy']
		});
	}
}