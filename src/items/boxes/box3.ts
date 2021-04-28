import { Box } from 'lib/handlers/Item/Box';

export default class God extends Box {
	constructor() {
		super('box3', {
			name: 'God Box', tier: 2, cost: 500, info: {
				short: 'Tier 2 box filled with EPIC treats!',
				long: 'Includes medium-tier to god-tier items with some premium keys!'
			}, contents: { keys: 10, coins: [5e5, 5e6] }
		});
	}
}