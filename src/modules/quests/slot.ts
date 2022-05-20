import { Quest } from 'lib/objects';

export default class Extreme extends Quest {
	constructor() {
	    super('slot', {
			rewards: { coins: 15e6, item: [50000, 'dragon'] },
			target: [2e3, 'slots', 'jackpots'],
			difficulty: 'Extreme',
			info: 'Win 2,000 jackpots on slot machine.',
			name: 'Slot It',
	    });
	}
}
