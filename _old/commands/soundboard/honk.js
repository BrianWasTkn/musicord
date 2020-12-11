import Command from '../../classes/Command/Owner.js'
import { log } from '../../utils/logger.js'
import { Util } from 'discord.js'

export default new Command({
	name: 'sfgfd',
	aliases: ['sdfd'],
	description: 'shutdown your bot',
	usage: '[timeout]'
}, async (bot, args) => {

	try {
		if (args[0]) await Util.delayFor(parseInt(args[0], 10));
		await bot.destroy();
	} catch(error) {
		log('commandError', 'kill@main_command', error);
	}

})