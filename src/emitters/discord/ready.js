import Listener from '../../classes/Listener.js'

export default class Ready extends Listener {
	constructor(client) {
		super(client);
	}

	async run() {

		/** Log */
		try {
			this.log(
				'main', 
				`${this.client.user.username} is now ready to play some beats!`
			);
		} catch(error) {
			super.log('Ready@log_ready_msg');
		}

		/** Set first Presence */
		try {
			await this.client.user.setPresence({
				activity: {
					name: `${this.client.prefix}help`,
					type: 'STREAMING',
					url: 'https://twitch.tv/onlyhitus'
				}
			})
		} catch(error) {
			super.log('Ready@set_first_presence', error);
		}

		/** Interval */
		setInterval(async () => {
			const activities = [
				`Music in ${this.client.guilds.cache.size.toLocaleString()} servers`,
				`${this.client.config.prefix}help`,
				`Music for ${this.client.users.cache.size.toLocaleString()} users`
			];
			try {
				await this.client.user.setPresence({
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
	}
}