import { log } from '../../utils/logger.js'
import Command from '../../classes/Command.js'

export default new Command({
	name: 'treble',
	aliases: ['toggle-treble'],
	description: 'treble filter',
	usage: 'command',
	cooldown: 1000,
	music: true
}, async message => {
	try {
		const queue = await message.client.player.setFilter(message, 'treble')
		return queue;
	} catch(error) {
		log('commandError', 'treble', error)
		return error;
	}
})