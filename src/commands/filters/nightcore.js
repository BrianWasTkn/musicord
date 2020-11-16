import { logError } from '../../utils/logger.js'

export const nightcore = async (message) => {
	try {
		const queue = await message.client.player.setFilter(message, 'nightcore')
		return queue;
	} catch(error) {
		logError('Filters', 'nightcore', error)
		return error;
	}
}