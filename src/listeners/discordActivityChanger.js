import { logError, logInit } from '../utils/logger.js'

export async function run(bot) {
	try {

		/** Set first Presence */
		try {
			await bot.user.setActivity(`${bot.config.prefix[0]}help`, {
				type: 'STREAMING',
				url: 'https://twitch.tv/onlyhitus'
			})
		} catch(error) {
			logError('Listener', 'Unable to set client presence', error)
		}

		/** Interval */
		setInterval(async () => {
			const activities = [
				`music in ${bot.guilds.size} servers`,
				`${bot.config.prefix[0]}help`,
				`music for ${bot.users.size} users`
			];
			try {
				await bot.user.setActivity(activities[Math.floor(Math.random() * activities.length)], {
					type: 'STREAMING',
					url: 'https://twitch.tv/onlyhitus'
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