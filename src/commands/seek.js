import Command from '../classes/Command.js'
import { log } from '../utils/logger.js'
import { fromMs, toMs } from 'hh-mm-ss' 

export default new Command({
	name: 'seek',
	aliases: ['goto'],
	description: 'seek to a specified time of the track',
	usage: '<hh:mm:ss | seconds>',
	cooldown: 3e3,
	music: true
}, async (bot, message, [timestamp]) => {
	
	/** Check Playing State */
	const isPlaying = bot.player.isPlaying(message);
	if (!isPlaying) {
		return 'There\'s nothing playing in the queue.'
	}

	/** Parsing Time */
	let parse, ms, ts;
	ms = toMs(timestamp);
	ts = fromMs(timestamp);
	if (ms) {
		parse = ms;
	} else if (ts) {
		parse = toMs(ts)
	} else {
		return `Unable to parse **${timestamp}** as time.`
	}

	/** Do the thing */
	try {
		await bot.player.seek(message, parse * 1000)
		return `Seeked track at **${fromMs(parse)}**`
	} catch(error) {
		log('commandError', 'seek', error)
		return error;
	}
})