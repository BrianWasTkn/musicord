import Command from '../classes/Command.js'
import { logError } from '../utils/logger.js'
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

	/** ReGex */
	const tsRegex = /^((?:\d\d)\:(?:\d\d)\:(?:\d\d))$/gi;
	let parse;
	if (Number(timestamp)) {
		parse = fromMs(Math.floor(Math.abs(timestamp) * 1000))
	} else if (tsRegex.exec(timestamp)[1])  {
		parse = toMs(tsRegex.exec(timestamp)[1])
	} else {
		return 'Unable to parse timestamp.'
	}

	/** Do the thing */
	try {
		await bot.player.seek(message, parse)
	} catch(error) {
		logError('Command', 'Unable to seek to the track', 'error')
	}
})