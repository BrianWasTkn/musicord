import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'
import { 
	simpleEmbed,
	dynamicEmbed, 
	errorEmbed 
} from '../utils/embed.js'

export default new Command({
	name: 'loop',
	aliases: ['repeat'],
	description: 'loop either the current track or the whole queue.',
	usage: '<queue | song | off>'
}, async (bot, message, [method]) => {
	
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
		log('error', 'loop@checkQueue', error.stack);
		return errorEmbed({ title: 'loop@checkQueue', error: error });
	}

	try {
		// modes
		method = method.toLowerCase();
		let mode;
		if (['queue', 'playlist'].includes(method)) {
			mode = 2;
		} else if (['song', 'track', 'true'].includes(method)) {
			mode = 1;
		} else if (['off', 'false'].includes(method)) {
			mode = 0;
		} else {
			return simpleEmbed(message, 'Your options are: "queue", "track" or "off" only.');
		}
		
		// then set
		const repeatMode = queue => queue.repeatMode ? queue.repeatMode == 2 ? 'Queue': 'Track' : 'None';
		const queue = await bot.player.setRepeatMode(message, mode);
		return dynamicEmbed({
			title: 'Player Loop',
			color: 'BLUE',
			description: `Now looping **${repeatMode(queue)}** for the player.`,
			fields: {
				'Action by': { content: message.author.tag }
			},
			footer: {
				text: `Thanks for using ${bot.user.username}!`,
				icon: bot.user.avatarURL()
			}
		})
	} catch(error) {
		log('commandError', 'loop@loop', error)
		return errorEmbed(message, error);
	}
})