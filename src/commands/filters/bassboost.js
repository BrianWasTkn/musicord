import { logError } from '../../utils/logger.js'

export const bassboost = async (message) => {
	try {
		const queue = await message.client.player.setFilter(message, 'bassboost')
		return queue;
	} catch(error) {
		logError('Filters', 'bassboost', error)
		return error;
	}
}