import { Spawn } from 'lava/index';

export default class extends Spawn {
	constructor() {
		super('crib', {
			display: {
				description: 'The babies are in need of milk!',
				title: 'Memers Crib',
				strings: ['bruh'],
				tier: 'COMMON'
			}, 
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