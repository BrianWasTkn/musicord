import { log } from '../utils/logger.js'

export async function run(bot) {
	try {
		/** Emit first to instantiate ClientUser */
		bot.on('ready', async () => {
			/** Set first Presence */
			try {
				await bot.user.setPresence({
					activity: {
						name: `${bot.prefix[0]}help`,
						type: 'STREAMING',
						url: 'https://twitch.tv/onlyhitus'
					}
				})
			} catch(error) {
				log('listenerError', 'activityChanger@set_first_presence', error)
			}

			/** Interval */
			setInterval(async () => {
				const activities = [
					`Music in ${bot.guilds.cache.size.toLocaleString()} servers`,
					`${bot.config.prefix[0]}help`,
					`Music for ${bot.users.cache.size.toLocaleString()} users`
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
					log('listenerError', 'activityChanger@set_presence_interval', error)
				}
			}, 1000 * 60) // 1 Minute (1000ms * 60secs)
		})
		log('main', 'Activity Changer')
	} catch(error) {
		log('listenerError', 'activityChanger', error)
	}
}