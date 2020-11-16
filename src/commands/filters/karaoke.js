import { logError } from '../../utils/logger.js'

export const karaoke = async (message) => {
	try {
		const queue = await message.client.player.setFilter(message, 'karaoke')
		return queue;
	} catch(error) {
		logError('Filters', 'karaoke', error)
		return error;
	}
}