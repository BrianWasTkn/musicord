import { log } from '../../utils/logger.js'
import Command from '../../classes/Command/Filter.js'

export default new Command({
	name: 'nightcore',
	usage: 'command'
}, async message => {
	try {
		const queue = await message.client.player.setFilter(message, 'nightcore')
		return queue;
	} catch(error) {
		log('commandError', 'nightcore', error)
		return error;
	}
})