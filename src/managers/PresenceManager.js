import Manager from '../classes/Manager.js'

const { Constants: Events } = require('discord.js');

export default class PresenceManager extends Manager {
	constructor(client) {
		super(client);
		
		/* Events */
		this.client.on(Events.READY, this.handle({ Bot: this.client }));
	}

	async handle({ Bot }) {
		try {
			/* Log */
			try {
				this.log(`${Bot.user.username} is now ready to play some beats!`);
			} catch(error) {
				super.log('PresenceManager', error);
			}

			/* Activity */
			try {
				await Bot.user.setPresence({
					activities: {
						type: 'LISTENING',
						name: `${Bot.prefix}help`
					}
				});
			} catch(error) {
				super.log('PresenceManager', error);
			}
		} catch(error) {
			super.log('PresenceManager', error);
		}
	}
}