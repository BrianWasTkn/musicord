import Command from '../../classes/Command.js'

export default new Command({
	name: 'ping',
	aliases: ['pong'],
	description: 'check your shard\'s current latency',
	usage: 'command'
}, async (bot, message, [cmd]) => {
	if (!cmd) return 'You need something to reload';

	if (cmd === 'commands') {
		try {
			await bot.reloadCommands();
			return 'Reloaded most commands probably'
		} catch(error) {
			return error;
		}
	} else if (cmd === 'e') {
		return 'e'
	}
})