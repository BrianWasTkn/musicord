import { Quest } from 'lib/objects';

export default class Hard extends Quest {
	constructor() {
		super('dice',{
			rewards: { coins: 150e3, item: [150, 'porsche'] },
			target: [2e3, 'bet', 'wins'],
			diff: 'Hard',
			info: 'Win 2,000 games of gambling.',
			name: 'Dice It',
		});
	}
}
