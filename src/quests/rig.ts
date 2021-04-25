import { Quest } from 'lib/handlers/quest';

export default class Medium extends Quest {
	constructor() {
	    super('rig', {
			rewards: { coins: 100e3, item: [100, 'xplo'] },
			target: [100, 'slots', 'wins'],
			diff: 'Medium',
			info: 'Win 150 jackpots on slots.',
			name: 'Rig It',
	    });
	}
}
