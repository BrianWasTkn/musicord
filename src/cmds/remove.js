import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'
import { 
	simpleEmbed,
	dynamicEmbed, 
	errorEmbed 
} from '../utils/embed.js'

export default new Command({
	name: 'remove',
	aliases: ['rid'],
	description: 'remove a song from a queue.',
	usage: '<index>'
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

		/** Else, remove */
		try {
			const index = parseInt(args[0], 10);
			// index isNaN or empty
			if (!index || isNaN(args[0])) {
				return simpleEmbed({
					title: 'Invalid Number',
					color: 'RED',
					text: 'You need a valid index number to parse.'
				});
			}
			// index is above or below queue.songs.length
			if (index > queue.songs.length || index < 1) {
				return simpleEmbed({
					title: 'Invalid Track',
					color: 'RED',
					text: 'No track(s) were found on that index number.'
				});
			}
			// removal process
			const song = queue.songs[index - 1];
			await bot.player.remove(message, index - 1);
			// return an embed
			return dynamicEmbed({
				title: 'Track Removed',
				color: 'BLUE',
				text: `Track at **index ${index}** has been removed from the queue.`,
				fields: {
					'Action by': { content: message.author.tag }
				},
				footer: {
					text: `Thanks for using ${bot.user.username}!`,
					icon: bot.user.avatarURL()
				}
			});
		} catch(error) {
			log('error', 'remove@main_command', error.stack);
			return errorEmbed({ title: 'remove@main_command', error: error });
		}
	} catch(error) {
		log('error', 'remove@checkQueue', error.stack);
		return errorEmbed({ title: 'remove@checkQueue', error: error });
	}

})