import Command from '../../classes/Command.js'
import { log } from '../../utils/logger.js'

export default new Command({
	name: 'kill',
	aliases: ['shutdown'],
	description: 'shutdown your bot',
	permissions: ['ADMINISTRATOR'],
	usage: 'command'
}, async (bot, message, args) => {

	try {
		await bot.destroy();
	} catch(error) {
		log('commandError', 'kill', error)
	}

})