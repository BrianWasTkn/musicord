import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'
import { blue } from '../utils/colors.js'
import { 
	simpleEmbed, 
	generateError 
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
		return {
			author: {
				name: bot.user.username,
				iconURL: bot.user.avatarURL()
			},
			color: blue,
			title: song.name,
			fields: [
				{ name: 'Link', value: `[Click Here](${song.url})`, inline: true },
				{ name: 'Duration', value: `\`${song.formattedDuration}\``, inline: true },
				{ name: 'Added by', value: song.user.mention, inline: true },
				{ name: 'Views', value: song.views.toLocaleString(), inline: true },
				{ name: 'Likes', value: song.likes.toLocaleString(), inline: true },
				{ name: 'Dislikes', value: song.dislikes.toLocaleString(), inline: true }
			]
		}
	} catch(error) {
		log('commandError', 'nowplaying@getQueue', error.stack);
		return generateError(message, error);
	}
})