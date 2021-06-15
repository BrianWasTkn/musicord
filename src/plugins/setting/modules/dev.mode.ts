import { Setting } from 'lava/index';

export default class extends Setting {
	constructor() {
		super('dev.mode', {
			cooldown: 0,
			default: true,
			description: 'Well hello there owo',
			name: 'Developer Mode',
		});
	}
}