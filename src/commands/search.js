import Command from '../classes/Command/Music.js'
import { log } from '../utils/logger.js'
import { 
	simpleEmbed,
	dynamicEmbed, 
	errorEmbed 
} from '../utils/embed.js'

export default new Command({
	name: 'search',
	aliases: ['find'],
	description: 'search a track',
	usage: '<track>',
	cooldown: 10000
}, async (bot, message, args) => {

	/** Args */
	if (args.length < 1) {
		return 'You need to search something.'
	}

	/** Do the thing */
	let results, found, msg, choice, index;
	try {
		/** Search Results */
		results = await bot.player.search(args.join(' '));
		found = results.slice(0, 10).map((song, index) => `**#${index + 1}:** [__${song.name}__](${song.url}) - \`${song.formattedDuration}\``);
		
		/** Send Message */
		try {
			msg = await message.channel.send(dynamicEmbed({
				title: 'Search Results',
				color: 'BLUE',
				text: found.join('\n'),
				fields: {
					'Instructions': { content: 'Type the **# number** of your choice. You only have **30 seconds** or your search will be cancelled.' }
				},
				footer: {
					text: `Thanks for using ${bot.user.username}!`,
					icon: bot.user.avatarURL()
				}
			}));
		} catch(error) {
			/** Log Error */
			log('commandError', 'search@results_message', error)
			return errorEmbed(message, error);
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
			index = choice.first().content;
			// Quick check if it's a number
			switch(index) {
				case index.toLowerCase() === 'cancel':
					await cancel();
					break;
				case isNaN(index):
					throw new Error(`Cannot parse ${index} as number.`)
					break;
				case parseInt(index, 10) > results.length:
					throw new Error(`Your choice shouldn't be greater than ${found.length}.`)
					break;
				case parseInt(index, 10) < 1:
					throw new Error(`Are you really dumb? Imagine answering negative numbers.`)
					break;
			}
		} catch(error) {
			/** Log Error */
			log('commandError', 'search@parse_choice', error.stack);
			return errorEmbed(message, error);
		}

		/** Cancel */
		const cancel = async () => {
			try {
				await bot.player.emit('searchCancel');
			} catch(error) {
				/** Log Error */
				log('commandError', 'search@emit_searchCancel', error.stack);
				return errorEmbed(message, error);
			}
		}

		/** Play */
		try {
			await bot.player.play(message, results[parseInt(index, 10) - 1].url)
			try {
				/** Delete Search Result Message */
				await msg.delete({ reason: `Search results by ${message.author.tag}`})
			} catch(error) {
				/** Log Error */
				log('commandError', 'search@delete_results_embed', error)
				return errorEmbed(message, error);
			}
		} catch(error) {
			/** Log Error */
			log('commandError', 'search@play_song', error)
			return errorEmbed(message, error);
		}
	} catch(error) {
		/** Log Error */
		log('commandError', 'search@search_tracks', error)
		return errorEmbed(message, error);
	}
})