import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'
import { formatToSecond, formatDuration } from '../utils/duration.js'
import { 
	simpleEmbed,
	dynamicEmbed, 
	errorEmbed 
} from '../utils/embed.js'

export default new Command({
	name: 'seek',
	aliases: ['goto'],
	description: 'seek to a specified time of the track',
	usage: '<hh:mm:ss | seconds>',
	cooldown: 5e3
}, async (bot, message, args) => {
	
	/** Check Playing State */
	try {
		const queue = bot.player.getQueue(message);
		if (!queue) {
			return simpleEmbed({
				title: 'Player Empty',
				color: 'RED',
				text: 'There\'s nothing playing in the queue.'
			})
		}
	} catch(error) {
		log('error', 'seek@checkQueue', error.stack);
		return errorEmbed({ title: 'seek@checkQueue', error: error });
	}

	/** Parsing Time */
	let parsed;
	if (args.join(' ').match(/:/g)) {
		parsed = formatToSecond(args.join(' '));
	} else {
		parsed = formatToSecond(formatDuration(args.join(' ')));
	}

	/** Do the thing */
	try {
		await bot.player.seek(message, parsed * 1000);
		return simpleEmbed(message, `Seeked track at ${formatDuration(parsed)}.`)
	} catch(error) {
		log('commandError', 'seek', error)
		return errorEmbed(message, error);
	}
})