import Command from '../../classes/Command/Owner.js'
import { log } from '../../utils/logger.js'

export default new Command({
	name: 'reload',
	aliases: ['r'],
	description: 'unloads and load the command from cache.',
	usage: '<cmdName>'
}, async (bot, [opt]) => {

	if (!opt) return 'You need a `cmd`';
	const command = bot.commands.get(opt) || bot.aliases.get(opt);
	if (!command) return 'nani no command found, sadness.'
	if (command) {
		try {
			await bot.unloadCommand(command.name);
			await bot.loadCommand(command.name);
		} catch(error) {
			return error;
		}
	}

})