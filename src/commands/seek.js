import Command from '../classes/Command.js'
import { log } from '../utils/logger.js'
import { formatToSecond, formatDuration } from '../utils/duration.js'

export default new Command({
	name: 'seek',
	aliases: ['goto'],
	description: 'seek to a specified time of the track',
	usage: '<hh:mm:ss: any | seconds: Number>',
	cooldown: 3e3,
	music: true
}, async (bot, message, args) => {
	
	/** Check Playing State */
	const isPlaying = bot.player.isPlaying(message);
	if (!isPlaying) {
		return 'There\'s nothing playing in the queue.'
	}

	/** Parsing Time */
	let parsed;
	if (args.join(' ').match(/:/g)) {
		parsed = formatToSecond(args) * 1000;
	} else {
		parsed = args[0] * 1000;
	}

	/** Do the thing */
	try {
		await bot.player.seek(message, parsed)
		return `Seeked track at **${formatDuration(parsed)}**`
	} catch(error) {
		log('commandError', 'seek', error)
		return error;
	}
})