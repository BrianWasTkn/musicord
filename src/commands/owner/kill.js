import Command from '../../classes/Command/Owner.js'
import { log } from '../../utils/logger.js'
import { Util } from 'discord.js'

export default new Command({
	name: 'kill',
	aliases: ['shutdown'],
	description: 'shutdown your bot',
	usage: '[timeout]'
}, async (bot, args) => {

	try {
		if (args[0]) await Util.delayFor(args[0]);
		await bot.destroy();
	} catch(error) {
		log('commandError', 'kill', error);
	}

})