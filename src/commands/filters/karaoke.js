import { logError } from '../../utils/logger.js'
import Command from '../../classes/Command.js'

export default new Command({
	name: 'karaoke',
	aliases: ['toggle-karaoke'],
	description: 'karaoke filter',
	usage: '<on | off>'
}, async message => {
	try {
		const queue = await message.client.player.setFilter(message, 'karaoke')
		return queue;
	} catch(error) {
		logError('Filters', 'karaoke', error)
		return error;
	}
})