import { Spawn, SpawnDisplay } from 'lava/index';

const display: SpawnDisplay = {
	description: 'The idiots are in need of milk!',
	title: 'Memers Crib',
	emoji: ':thinking:',
	strings: ['bruh'],
	tier: 'COMMON'
}

export default class extends Spawn {
	constructor() {
		super('crib', {
			display, 
			config: {
				enabled: true,
				method: 'message',
				cooldown: 60e3, // do "nextPossibleRun" instead of timeout.
				rewards: [1, 10],
				duration: 10e3,
				odds: 5,
				maxEntries: 3
			}
		});
	}
}