import { log } from '../../utils/logger.js'
import Command from '../../classes/Command.js'

export default new Command({
	name: 'bassboost',
	aliases: ['toggle-bassboost'],
	description: 'bassboost filter',
	usage: '<-30 to 20>: Number',
	cooldown: 1000,
	music: true
}, async message => {
	try {
		const queue = await message.client.player.setFilter(message, 'bassboost')
		return queue;
	} catch(error) {
		log('commandError', 'bassboost', error)
		return error;
	}
})