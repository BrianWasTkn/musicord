import { Quest } from '@lib/handlers/quest';

export default class Hard extends Quest {
	constructor() {
		super('dice', {
			target: 2e3,
			diff: 'Hard',
			info: 'Win 2,000 games of gambling.',
			name: 'Dice It',
		}, {
			coins: 150e3,
			item: [15, 'porsche']
		});
	}
}