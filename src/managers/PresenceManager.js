import Manager from '../classes/Manager.js'
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
		/** Set first Presence */
		try {
			await Bot.user.setPresence({
				activity: {
					name: `${Bot.prefix}help`,
					type: 'STREAMING',
					url: 'https://twitch.tv/onlyhitus'
				}
			});
			
			/** Interval */
			setInterval(async () => {
				const activities = [
					`Music in ${Bot.guilds.cache.size} servers`,
					`${Bot.prefix}help`,
					`Music for ${Bot.users.cache.size} users`
				];
				try {
					await Bot.user.setPresence({
						activity: {
							name: activities[Math.floor(Math.random() * activities.length)],
							type: 'STREAMING',
							url: 'https://twitch.tv/onlyhitus'
						}
					})
				} catch(error) {
					super.log('Ready@set_presence_interval', error)
				}
			}, 1000 * 60) // 1 Minute (1000ms * 60secs)
		} catch(error) {
			super.log('Ready@set_first_presence', error);
		}

	}
}