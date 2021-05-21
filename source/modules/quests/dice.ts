import { Quest } from 'lib/objects';

export default class Hard extends Quest {
	constructor() {
		super('dice',{
			rewards: { coins: 10e6, item: [100, 'porsche'] },
			target: [1e3, 'bet', 'wins'],
			difficulty: 'Hard',
			info: 'Win 1,000 games of gambling.',
			name: 'Dice It',
		});
	}
}
