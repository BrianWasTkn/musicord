import { log } from '../../utils/logger.js'
import Command from '../../classes/Command/Filter.js'

export default new Command({
	name: 'bassboost',
	usage: '<-30 to 20>'
}, async message => {
	try {
		const queue = await message.client.player.setFilter(message, 'bassboost')
		return queue;
	} catch(error) {
		log('commandError', 'bassboost', error)
		return error;
	}
})