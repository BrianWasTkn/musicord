import { Quest } from 'lib/objects';

export default class Medium extends Quest {
	constructor() {
	    super('rig', {
			rewards: { coins: 20e6, item: [200, 'crazy'] },
			target: [200, 'slots', 'wins'],
			difficulty: 'Medium',
			info: 'Win 200 jackpots on slots.',
			name: 'Rig It',
	    });
	}
}
