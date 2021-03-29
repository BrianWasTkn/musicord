import { Quest } from '@lib/handlers/quest';

export default class Medium extends Quest {
	constructor() {
		super('gamble', {
			diff: 'Medium',
			info: 'Win 2,000 games of gambling!',
			name: 'Gamble Pursuit',
		}, {
			amount: 500000,
		}, {
			porche: 250,
		});
	}
}