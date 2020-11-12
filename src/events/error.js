import { logError } from '../utils/logger.js'

export async function run(bot, error) {
	await logError('Event', 'Discord Error', error)
}