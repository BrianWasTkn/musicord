import Command from '../classes/Command.js'
import { logError } from '../utils/logger.js'

export default new Command({
	name: 'search',
	aliases: ['find'],
	description: 'search a track',
	usage: '<track>',
	cooldown: 3e3,
	music: true
}, async (bot, message, args) => {

	/** Args */
	if (!args) {
		return 'You need to search something.'
	}

	/** Do the thing */
	let results, found, msg, choice, index;
	try {
		/** Search Results */
		results = await bot.player.search(args.join(' '))
		found = results.map((song, index) => `**#${index + 1}:** [${song.name}](${song.url}) - \`${song.formattedDuration}\``).slice(0, 10)
		
		/** Send Message */
		try {
			msg = await message.channel.send({
				embed: {
					author: {
						name: 'Search Results',
						iconURL: message.guild.iconURL()
					},
					title: `Found ${found.length} tracks`,
					color: 'BLUE',
					description: found.join('\n'),
					fields: [
						{ name: 'Instructions', value: 'Type the **number** of your choice.\nYou can cancel by typing out `cancel` right now.' }
					]
				}
			})
		} catch(error) {
			/** Log Error */
			logError('Command', 'Cannot send search results message', error)
		}

		/** Await Message */
		try {
			choice = await message.channel.awaitMessages(m => m.author.id === message.author.id, {
				max: 1,
				time: 1e4,
				errors: ['time']
			})
			// No Answer
			if (!choice.first()) {
				throw new Error(`Next time if you're just gonna let me waste my time don't use this command again okay?`)
			}
		} catch(error) {
			/** Log Error */
			logError('Command', 'An error in messageCollector', error.stack)
			return error;
		}

		/** Parsing Index */
		try {
			// Parse Index Number
			index = parseInt(choice.first().content, 10);
			// Quick check if it's a number
			if (isNaN(index) || index > results.length || index < 1) {
	      throw new Error(`Cannot parse ${index} as number.`)
	    };
		} catch(error) {
			/** Log Error */
			logError('Command', 'Parsing error', error)
		}

		/** Play */
		try {
			await bot.player.play(message, results[index - 1].url)
			try {
				/** Delete Message */
				await msg.delete()
			} catch(error) {
				/** Log Error */
				logError('Command', 'Cannot delete search embed', error)
			}
		} catch(error) {
			/** Log Error */
			logError('Command', 'Cannot play searched song', error)
		}
	} catch(error) {
		/** Log Error */
		logError('Command', 'Unable to search tracks', error)
	}
})