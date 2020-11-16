import { logError } from '../../utils/logger.js'
import Command from '../../classes/Command.js'

export default new Command({
	name: 'bassboost',
	aliases: ['toggle-bassboost'],
	description: 'bassboost filter',
	usage: '<db | -30 to 20>'
}, async message => {
	try {
		const queue = await message.client.player.setFilter(message, 'bassboost')
		return queue;
	} catch(error) {
		logError('Filters', 'bassboost', error)
		return error;
	}
})