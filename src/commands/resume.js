import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'

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

	/** Else, play */
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
		log('commandError', 'resume', error)
		return error;
	}
})