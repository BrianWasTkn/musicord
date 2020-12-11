import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'
import { 
	simpleEmbed,
	dynamicEmbed, 
	errorEmbed 
} from '../utils/embed.js'

export default new Command({
	name: 'nowplaying',
	aliases: ['np'],
	description: 'View the current track playing in the queue.',
	usage: 'command'
}, async (bot, message) => {
	
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
		
		/** Fetch the song at index 0 */
		try {
			const song = queue.songs[0];
			return dynamicEmbed({
				title: 'Currently Playing',
				color: 'BLUE',
				text: `Currently playing [**__${song.name}__**](${song.url}) in the queue.`,
				fields: {
					'Link': { 		content: `[${song.id}](${song.url})`, 		inline: true },
					'Duration': { content: `\`${song.formattedDuration}\``, inline: true },
					'Added by': { content: song.user.mention,								inline: true },
					'Views': {		content: song.views.toLocaleString(),			inline: true },
					'Likes': {		content: song.likes.toLocaleString(),			inline: true },
					'Dislikes': {	content: song.dislikes.toLocaleString(),	inline: true }
				},
				footer: {
					text: `Thanks for using ${bot.user.username}!`,
					icon: bot.user.avatarURL()
				}
			});
		} catch(error) {
			log('commandError', 'nowplaying@getQueue', error.stack);
			return errorEmbed({ title: 'nowplaying@getQueue', error: error });
		}
	} catch(error) {
		log('error', 'nowplaying@checkQueue', error.stack);
		return errorEmbed({ title: 'nowplaying@checkQueue', error: error });
	}

})