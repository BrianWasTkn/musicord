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
	try {
		const queue = bot.player.getQueue(message);
		if (!queue) {
			return simpleEmbed({
				title: 'Player Empty',
				color: 'RED',
				text: 'There\'s nothing playing in the queue.'
			})
		}

		/** Do the thing */
		try {
			const queue = await bot.player.shuffle(message),
			songs = queue.songs.map((song, index) => `**#${index + 1}**: [__${song.name}__](${song.url}) - \`${song.formattedDuration}\``);
			const msgs = [dynamicEmbed({
				title: 'Queue Shuffled',
				color: 'BLUE',
				text: 'The songs are now shuffled on the queue.',
				footer: {
					text: `Thanks for using ${bot.user.username}!`,
					icon: bot.user.avatarURL()
				}
			}), dynamicEmbed({
				title: 'Server Queue',
				color: 'BLUE',
				text: songs.join('\n'),
				footer: {
					text: `Thanks for using ${bot.user.username}!`,
					icon: bot.user.avatarURL()
				}
			})];
			
			/** Send the Messages */
			try {
				for await (const msg of msgs) {
					message.channel.send(msg);
				}
			} catch(error) {
				log('commandError', 'shuffle@send_messages', error)
				return errorEmbed({ title: 'shuffle@send_messages', error: error });
			}
		} catch(error) {
			log('commandError', 'shuffle@main_command', error)
			return errorEmbed({ title: 'shuffle@main_command', error: error });
		}
	} catch(error) {
		log('error', 'shuffle@checkQueue', error.stack);
		return errorEmbed({ title: 'shuffle@checkQueue', error: error });
	}

})