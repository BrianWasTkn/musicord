import { Setting } from 'lava/index';

export default class extends Setting {
	constructor() {
		super('notifs.dm', {
			cooldown: 1000 * 60 * 1,
			default: false,
			description: 'Allows me to send bot notifications in your Direct Messages.',
			name: 'Bot Notifications',
		});
	}
}