import Command from '../../classes/Command/Owner.js'
import { log } from '../../utils/logger.js'

export default new Command({
	name: 'leaveguild',
	aliases: ['lg'],
	description: 'Make me leave from a discord guild you specify.',
	usage: '<Guild>.id'
}, async (bot, [id]) => {

	if (!id) return 'You need a guild id';
	const g = bot.guilds.cache.get(id);
	if (!g) return 'Invalid guild id';
	try {
		const guild = await g.leave();
		return `Successfully left **${guild.name}**`
	} catch(error) {
		return error.message;
	}

})