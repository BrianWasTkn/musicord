import { Quest } from '@lib/handlers/quest';

export default class Difficult extends Quest {
	constructor() {
		super('taste', {
			diff: 'Difficult',
			info: 'Buy 10 Donut Rings.',
			name: 'Taste It',
		}, {
			coins: 5e5,
			item: [10, 'pee']
		});
	}
}