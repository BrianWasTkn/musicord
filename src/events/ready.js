import { logInit } from '../utils/logger.js'

export async function run(bot) {
	await logInit('Main', `${bot.user.tag} is now ready to play some beats!`)
}