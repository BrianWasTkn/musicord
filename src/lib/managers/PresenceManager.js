import Manager from '../structures/Manager.js'
const { Constants: Events } = require('discord.js');

export default class PresenceManager extends Manager {
	constructor(client) {
		super(client);
		/* Handle */
		client.on(Events.CLIENT_READY, async () => await this.handle({
			Bot: this.client
		}));
	}

	async handle({ Bot }) {
		try {	
			/** Interval */
			setInterval(async () => {
				const activities = [
					`${Bot.users.cache.size} users`,
					`${Bot.prefix}help`
				];
				try {
					await Bot.user.setPresence({
						activity: {
							name: activities[Math.floor(Math.random() * activities.length)],
							type: 'LISTENING',
							url: 'https://twitch.tv/onlyhitus'
						}
					})
				} catch(error) {
					super.log('PresenceManager@set_presence_interval', error)
				}
			}, 1000 * 60) // 1 Minute (1000ms * 60secs)
		} catch(error) {
			super.log('PresenceManager@interval', error);
		}
	}
}