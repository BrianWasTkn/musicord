import { Quest } from 'lava/index';

export default class extends Quest {
	constructor() {
		super('buy', {
			name: 'Buy It',
			method: 'buy',
			command: 'buy',
			target: 1,
			info: 'Buy {target} of any item!',
			rewards: {
				coins: 15000,
				item: {
					amount: 1,
					item: 'coin'
				}
			}
		});
	}
}