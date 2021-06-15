import { Setting } from 'lava/index';

export default class extends Setting {
	constructor() {
		super('colors.seasonal', {
			cooldown: 1000,
			default: false,
			description: 'Sets your embed colors to something related to the current season of the year.',
			name: 'Seasonal Colors',
		});
	}
}