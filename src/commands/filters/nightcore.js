import { log } from '../../utils/logger.js'
import Command from '../../classes/Command.js'

export default new Command({
	name: 'nightcore',
	aliases: ['toggle-nightcore'],
	description: 'nightcore filter',
	usage: 'command',
	cooldown: 1000,
	music: true
}, async message => {
	try {
		const queue = await message.client.player.setFilter(message, 'nightcore')
		return queue;
	} catch(error) {
		log('commandError', 'nightcore', error)
		return error;
	}
})