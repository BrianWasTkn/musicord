import Command from '../classes/Command.js'
import { logError } from '../utils/logger.js'

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
	const number = Number(timestamp);
	const patterns = {
		seconds: /(00\:\d\d)/gi.exec(timestamp),
		minutes: /(\d\d\:\d\d)/gi.exec(timestamp),
		hours: /(\d\d\:\d\d\:\d\d)/gi.exec(timestamp)
	}

	/** Check */
	let time;
	if (patterns.seconds[1]) {
		time = patterns.seconds
	} else if (patterns.minutes[1]) {
		time = patterns.minutes
	} else if (patterns.hours[1]) {
		time = patterns.hours
	} else if (number) {
		time = number
	} else {
		return `Unable to parse \`${time}\` as a time.`
	}

	/** Do the thing */
	try {
		await bot.player.seek(message, time)
	} catch(error) {
		logError('Command', 'Unable to seek to the track', 'error')
	}
})