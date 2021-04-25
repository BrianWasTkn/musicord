import { Quest } from 'lib/handlers/quest';

export default class Extreme extends Quest {
	constructor() {
	super('lava', {
		rewards: { coins: 500e6, item: [5e4, 'porsche'] },
		target: [5e3, 'blackjack', 'wins'],
		diff: 'Extreme',
		info: 'Win 5,000 games of blackjack.',
		name: 'Lava Randomness',
	});
	}
}
