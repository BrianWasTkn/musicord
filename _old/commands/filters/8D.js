import { log } from '../../utils/logger.js'
import Command from '../../classes/Command/Filter.js'

export default new Command({
	name: '8D',
	usage: 'command'
}, async message => {
	try {
		const queue = await message.client.player.setFilter(message, '8D')
		return queue;
	} catch(error) {
		log('commandError', '8D', error)
		return error;
	}
})