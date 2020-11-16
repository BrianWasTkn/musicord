import { logError } from '../../utils/logger.js'
import Command from '../../classes/Command.js'

export default new Command({
	name: 'nightcore',
	aliases: ['toggle-nightcore'],
	description: 'nightcore filter',
	usage: '<on | off>'
}, async message => {
	try {
		const queue = await message.client.player.setFilter(message, 'nightcore')
		return queue;
	} catch(error) {
		logError('Filters', 'nightcore', error)
		return error;
	}
})