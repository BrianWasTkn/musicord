import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'
import { 
	simpleEmbed, 
	generateError 
} from '../utils/embed.js'

export default new Command({
	name: 'resume',
	aliases: ['unfreeze'],
	description: 'resume playing the current queue',
	usage: 'command'
}, async (bot, message, args) => {

	/** Check if paused */
	const paused = bot.player.isPaused(message);
	if (!paused) {
		return 'The player is not paused.'
	}

	/** Else, resume */
	try {
		await bot.player.resume(message);
		await message.channel.send({ 
			embed: {
				title: 'Player Resumed',
				color: 'BLUE',
				description: `User **${message.author.tag}** has resumed the queue.`
			}
		})
	} catch(error) {
		log('commandError', 'resume', error.stack);
		return generateError(message, error);
	}
})