import { log } from '../../utils/logger.js'
import Command from '../../classes/Command.js'

export default new Command({
	name: '8D',
	aliases: ['toggle-8D'],
	description: '8D filter',
	usage: '<on | off>: any',
	cooldown: 1000,
	music: true
}, async message => {
	try {
		const queue = await message.client.player.setFilter(message, '8D')
		return queue;
	} catch(error) {
		log('commandError', '8D', error)
		return error;
	}
})