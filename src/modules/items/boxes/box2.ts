import { Box } from 'lib/objects';

export default class Fire extends Box {
	constructor() {
		super('box2', {
			name: 'Fire Box', tier: 2, cost: 125, info: {
				short: 'Tier 2 box filled with FUN surprises!',
				long: 'Includes low-tier to god-tier items with some premium keys!'
			}, contents: { keys: 5, coins: [1e5, 25e4], tiers: [1, 3] }
		});
	}
}