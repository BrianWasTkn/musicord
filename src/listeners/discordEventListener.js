import { logInit, logError } from '../utils/logger.js'

export const discordEventListener = async function run(bot) {
	bot.on('ready', async () => {
		await logInit('Main', `${bot.user.tag} is now ready to play some beats!`)
	})
}