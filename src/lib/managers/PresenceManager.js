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
		if (Bot.config.devMode) {
			Bot.user.setPresence({
				status: 'dnd',
				activity: {
					name: 'Developer Mode',
					type: 'WATCHING'
				}
			}).then(presence => {
				[ `PresenceManager@status: ${presence.status}`,
				`PresenceManager@appID: ${presence.activities[0].applicationID}`,
				`PresenceManager@name: ${presence.activities[0].name}`
				].forEach(tag => {
					Bot.utils.log('Manager', 'main', tag);
				});
			}).catch(error => {
				super.log('DevMode:PresenceManager@presence', error);
			});
		} else {
			/** Interval */
			setInterval(async () => {
				const activities = Bot.config.activities(Bot);
				try {
					await Bot.user.setPresence({
						activity: {
							name: activities[Math.floor(Math.random() * activities.length)],
							type: 'STREAMING',
							url: 'https://twitch.tv/onlyhitus'
						}
					})
				} catch(error) {
					super.log('PresenceManager@set_presence_interval', error)
				}
			}, 1000 * 60) // 1 Minute (1000ms * 60secs)
		}
	}
}