import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'
import { 
	simpleEmbed,
	dynamicEmbed, 
	errorEmbed 
} from '../utils/embed.js'

export default new Command({
	name: 'nowplaiyng',
	aliases: ['np'],
	description: 'View the current track playing in the queue.',
	usage: 'command'
}, async (bot, message) => {
	
	/** Check Playing State */
	const queue = bot.player.getQueue(message);
	if (!queue) {
		return simpleEmbed(message, 'There\'s nothing playing in the queue.');
	}

	try {
		const song = queue.songs[0];
		return dynamicEmbed({
			title: 'Currently Playing',
			color: 'BLUE',
			info: `Currently playing [**__${song.name}__**](${song.url}) in the queue.`,
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
		return errorEmbed(message, error);
	}
})