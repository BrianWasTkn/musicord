import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'
import { 
	simpleEmbed,
	dynamicEmbed, 
	errorEmbed 
} from '../utils/embed.js'

export default new Command({
	name: 'shuffle',
	aliases: ['randomize'],
	description: 'shuffle the current queue',
	usage: 'command'
}, async (bot, message) => {
	
	/** Check Playing State */
	const queue = bot.player.getQueue(message);
	if (!queue) {
		return simpleEmbed(message, 'There\'s nothing playing in the queue.');
	}

	/** Do the thing */
	try {
		const queue = await bot.player.shuffle(message),
		songs = queue.songs.map((song, index) => `**${index + 1}**: [${song.name}](${song.url}) - \`${song.formattedDuration}\``);
		const msgs = [dynamicEmbed({
			title: 'Queue Shuffled',
			color: 'BLUE',
			info: 'The songs are now shuffled on the queue.',
			footer: {
				text: `Thanks for using ${bot.user.username}!`,
				icon: bot.user.avatarURL()
			}
		}), dynamicEmbed({
			title: 'Server Queue',
			color: 'BLUE',
			info: songs.join('\n'),
			footer: {
				text: `Thanks for using ${bot.user.username}!`,
				icon: bot.user.avatarURL()
			}
		})];
		try {
			for await (const msg of msgs) {
				message.channel.send(msg);
			}
		} catch(error) {
			log('commandError', 'shuffle@send_messages', error)
			return errorEmbed(message, error);
		}
	} catch(error) {
		log('commandError', 'shuffle', error)
		return errorEmbed(message, error);
	}
})