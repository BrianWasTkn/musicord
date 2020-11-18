import Command from '../classes/Command.js'
import { log } from '../utils/logger.js'

export default new Command({
	name: 'search',
	aliases: ['find'],
	description: 'search a track',
	usage: '<track>',
	cooldown: 1e4,
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
		found = results.slice(0, 10).map((song, index) => `**#${index + 1}:** [__${song.name}__](${song.url}) - \`${song.formattedDuration}\``)
		
		/** Send Message */
		try {
			msg = await message.channel.send({
				embed: {
					title: `Found ${found.length} tracks`,
					color: 'BLUE',
					description: found.join('\n'),
					fields: [
						{ name: 'Instructions', value: 'Type the **number** of your choice.\nYou can cancel by typing out `cancel` right now.' }
					],
					footer: { text: 'You have 30 seconds to proceed otherwise your search is cancelled.' }
				}
			})
		} catch(error) {
			/** Log Error */
			log('commandError', 'search@results_message', error)
			return error;
		}

		/** Await Message */
		try {
			choice = await message.channel.awaitMessages(m => m.author.id === message.author.id, {
				max: 1,
				time: 3e4,
				errors: ['time']
			})
		} catch(error) {
			/** Log Error */
			if (!choice) {
				log('commandError', 'search@messageCollector', error)
				return 'Next time if you\'re just gonna let me waste my time don\'t use this command again okay?'
			}
		}

		/** Parsing Index */
		try {
			// Parse Index Number
			index = parseInt(choice.first().content, 10);
			// Quick check if it's a number
			switch(index) {
				case isNaN(index):
					throw new Error(`Cannot parse ${index} as number.`)
					break;
				case index > results.length:
					throw new Error(`Your choice shouldn't be greater than ${found.length}.`)
					break;
				case index < 1:
					throw new Error(`Are you really dumb? Imagine answering negative numbers.`)
					break;
			}
		} catch(error) {
			/** Log Error */
			log('commandError', 'search@parse_choice', error)
			return error;
		}

		/** Play */
		try {
			await bot.player.play(message, results[index - 1].url)
			try {
				/** Delete Search Result Message */
				await msg.delete({ reason: `Search results by ${message.author.tag}`})
			} catch(error) {
				/** Log Error */
				log('commandError', 'search@delete_results_embed', error)
				return error;
			}
		} catch(error) {
			/** Log Error */
			log('commandError', 'search@play_song', error)
			return error;
		}
	} catch(error) {
		/** Log Error */
		log('commandError', 'search@search_tracks', error)
		return error;
	}
})