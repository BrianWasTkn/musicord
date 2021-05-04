import { Quest } from 'lib/objects';

export default class Medium extends Quest {
	constructor() {
	    super('rig', {
			rewards: { coins: 100e3, item: [100, 'xplo'] },
			target: [150, 'slots', 'wins'],
			difficulty: 'Medium',
			info: 'Win 150 jackpots on slots.',
			name: 'Rig It',
	    });
	}
}
