import Command from '../../classes/Command/Owner.js'
import { log } from '../../utils/logger.js'
import { 
	dynamicEmbed, 
	errorEmbed 
} from '../../utils/embed.js'

export default new Command({
	name: 'leaveguild',
	aliases: ['lg'],
	description: 'Make me leave from a discord guild you specify.',
	usage: '<Guild>.id'
}, async (bot, [id]) => {

	try {
		/** Empty arg */
		if (!id) {
			return simpleEmbed({
				title: 'Missing Guild',
				color: 'RED',
				text: 'You need a valid and non-empty guild id.'
			});
		}

		/** Fetch Guild */
		const g = bot.guilds.cache.get(id);
		if (g) {
			/** Leave */
			try {
				const guild = await g.leave();
				return simpleEmbed({
					title: 'Left Guild',
					color: 'GREEN',
					text: `Successfully left guild **${guild.name}**.`
				});
			} catch(error) {
				log('commandError', 'leave@leave', error);
				return errorEmbed({ title: 'leave@leave', error: error });
			}
		} else {
			/** Unknown Guild */
			return simpleEmbed({
				title: 'Unknown Guild',
				color: 'RED',
				text: 'Unknown discord guild.'
			});
		}
	} catch(error) {
		log('commandError', 'leave@main_command', error);
		return errorEmbed({ title: 'leave@main_command', error: error });
	}

})