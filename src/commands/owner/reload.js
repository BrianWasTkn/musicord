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
	if (!command) {
		return 'nani no command found, sadness.';
	} else {
		try {
			const unload = await bot.unloadCommand(command.name);
			if (!unload) return 'Error unloading the command.';
			const load = await bot.loadCommand(command.name);
			if (!load) return 'UNable to load command';
			else return `Successfully reloaded ${load.name}!`
		} catch(error) {
			return error;
		}
	}

})