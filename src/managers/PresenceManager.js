import Manager from '../classes/Manager.js'

const { Constants: Events } = require('discord.js');

export default class PresenceManager extends Manager {
	constructor(client) {
		super(client);
		
		/* Events */
		this.client.on(Events.READY, this.handle);
	}

	async handle() {
		try {
			/* Log */
			try {
				this.log(`${this.client.user.username} is now ready to play some beats!`);
			} catch(error) {
				super.log('PresenceManager@log', error);
			}

			/* Activity */
			try {
				await this.client.user.setPresence({
					activities: {
						type: 'LISTENING',
						name: `${this.client.prefix}help`
					}
				});
			} catch(error) {
				super.log('PresenceManager@presence', error);
			}
		} catch(error) {
			super.log('PresenceManager', error);
		}
	}
}