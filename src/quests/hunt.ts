import { Quest } from '@lib/handlers/quest';

export default class Medium extends Quest {
	constructor() {
		super('hunt', {
			diff: 'Medium',
			info: 'Hunt 25 dragons.',
			name: 'Hunt It',
		}, {
			coins: 5e4,
			item: [3, 'herb']
		});
	}
}