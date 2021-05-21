import { Quest } from 'lib/objects';

export default class Extreme extends Quest {
	constructor() {
		super('lava', {
			rewards: { coins: 250e6, item: [25000, 'porsche'] },
			target: [5e3, 'blackjack', 'wins'],
			difficulty: 'Extreme',
			info: 'Win 5,000 games of blackjack.',
			name: 'Lava Randomness',
		});
	}
}
