import { log } from '../../utils/logger.js'
import Command from '../../classes/Command/Filter.js'

export default new Command({
	name: 'karaoke',
	usage: 'command'
}, async message => {
	try {
		const queue = await message.client.player.setFilter(message, 'karaoke')
		return queue;
	} catch(error) {
		log('commandError', 'karaoke', error)
		return error;
	}
})