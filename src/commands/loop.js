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

		/** Do the Thing */
		try {
			/** Methods */
			method = method.toLowerCase();
			let mode, aliases = {
				queue: ['queue', 'all'],
				track: ['song', 'track', 'true'],
				none: ['none', 'off', 'false']
			};

			if (aliases.queue.includes(method)) {
				mode = 2;
			} else if (aliases.track.includes(method)) {
				mode = 1;
			} else if (aliases.none.includes(method)) {
				mode = 0;
			} else {
				return dynamicEmbed({
					title: 'Wrong Arguments',
					color: 'RED',
					text: 'You typed the wrong arguments. The following options are available.',
					fields: {
						'Queue': { content: `\`${aliases.queue.join('`, `')}\`` },
						'Track': { content: `\`${aliases.track.join('`, `')}\`` },
						'None': {  content: `\`${aliases.none.join('`, `')}\`` }
					},
					footer: {
						text: `Thanks for using ${bot.user.username}!`,
						icon: bot.user.avatarURL()
					}
				});
			}
			
			/** Apply */
			const repeatMode = queue => queue.repeatMode ? queue.repeatMode == 2 ? 'Queue': 'Track' : 'None';
			const queue = await bot.player.setRepeatMode(message, mode);
			return dynamicEmbed({
				title: 'Player Loop',
				color: 'BLUE',
				description: `Now looping **${repeatMode(queue)}** for this guild.`,
				fields: {
					'Action by': { content: message.author.tag }
				},
				footer: {
					text: `Thanks for using ${bot.user.username}!`,
					icon: bot.user.avatarURL()
				}
			})
		} catch(error) {
			log('commandError', 'loop@main_command', error)
			return errorEmbed({ title: 'loop@main_command', error: error });
		}
	} catch(error) {
		log('error', 'loop@checkQueue', error.stack);
		return errorEmbed({ title: 'loop@checkQueue', error: error });
	}

})