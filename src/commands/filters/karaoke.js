import { log } from '../../utils/logger.js'
import Command from '../../classes/Command.js'

export default new Command({
	name: 'karaoke',
	aliases: ['toggle-karaoke'],
	description: 'karaoke filter',
	usage: '<on | off>',
	cooldown: 1000,
	music: true
}, async message => {
	try {
		const queue = await message.client.player.setFilter(message, 'karaoke')
		return queue;
	} catch(error) {
		log('commandError', 'karaoke', error)
		return error;
	}
})