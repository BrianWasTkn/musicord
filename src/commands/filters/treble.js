import { log } from '../../utils/logger.js'
import Command from '../../classes/Command/Filter.js'

export default new Command({
	name: 'treble',
	usage: 'command'
}, async message => {
	try {
		const queue = await message.client.player.setFilter(message, 'treble')
		return queue;
	} catch(error) {
		log('commandError', 'treble', error)
		return error;
	}
})