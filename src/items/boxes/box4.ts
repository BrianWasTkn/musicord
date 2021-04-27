import { Box } from 'lib/handlers/Item/Box';

export default class Legendary extends Box {
	constructor() {
		super('box4', {
			name: 'Legendary Box', tier: 3, cost: 100, info: {
				short: 'Tier 3 box filled with MASSIVE treats!',
				long: 'Includes god-tier items with premium keys!'
			}, contents: { keys: 25, coins: [1e6, 5e6] }
		});
	}
}