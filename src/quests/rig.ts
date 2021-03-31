import { Quest } from '@lib/handlers/quest';

export default class Medium extends Quest {
	constructor() {
		super('rig', {
			diff: 'Medium',
			info: 'Win 100 jackpots on slots.',
			name: 'Rig It',
		}, {
			coins: 100e3,
			item: [50, 'herb']
		});
	}
}