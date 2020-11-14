import { logError, logInit } from '../utils/logger.js'

export async function run(bot) {
	try {

		/** Set first Presence */
		try {
			/** Timeout: Bot needs to emit the ready event */
			/** To instantiate ClientUser */
			setTimeout(async () => {
				await bot.user.setPresence({
					activity: {
						name: `${bot.prefix[0]}help`,
						type: 'STREAMING',
						url: 'https://twitch.tv/onlyhitus'
					}
				})
			}, 1e4);
		} catch(error) {
			logError('Listener', 'Unable to set first client presence', error)
		}

		/** Interval */
		setInterval(async () => {
			const activities = [
				`Music in ${bot.guilds.cache.size} servers`,
				`${bot.config.prefix[0]}help`,
				`Music for ${bot.users.cache.size} users`
			];
			try {
				await bot.user.setPresence({
					activity: {
						name: activities[Math.floor(Math.random() * activities.length)],
						type: 'STREAMING',
						url: 'https://twitch.tv/onlyhitus'
					}
				})
			} catch(error) {
				logError('Listener', 'Unable to set client presence at interval', error)
			}
		}, 1000 * 60 * 10) // 10 Minutes (1000ms * 60secs * 10)
		logInit('Musicord', 'Activity Changer Loaded')
	} catch(error) {
		logError('Listener', 'Unable to initiate the activity changer', error)
	}
}