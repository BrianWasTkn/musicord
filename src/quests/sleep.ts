import { Quest } from '@lib/handlers/quest';

export default class Extreme extends Quest {
	constructor() {
		super('sleep', {
			diff: 'Extreme',
			info: 'Win 1,000 games of slots.',
			name: 'Wake It',
		}, {
			coins: 10e6,
			item: [200, 'coffee']
		});
	}
}