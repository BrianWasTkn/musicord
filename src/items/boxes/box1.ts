import { Box } from 'lib/handlers/Item/Box';

export default class Normie extends Box {
	constructor() {
		super('box1', {
			name: 'Normie Box', tier: 1, cost: 100, info: {
				short: 'Tier 1 box filled with FREE surprises!',
				long: 'Includes low-tier to medium-tier items with some premium keys!'
			}, contents: { keys: 1, coins: [1e3, 1e4] }
		});
	}
}