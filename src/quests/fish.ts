import { Quest } from '@lib/handlers/quest';

export default class Easy extends Quest {
	constructor() {
		super('fish', {
			diff: 'Easy',
			info: 'Fish 100 of any types.',
			name: 'Fish It',
		}, {
			coins: 5e4,
			item: [42e3, 'herb']
		});
	}
}