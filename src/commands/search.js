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
	try {
		const result = await bot.player.search(args.join(' '))
		const found = result.map((song, index) => `**#${index + 1}:** [**${song.name}**](${song.url}) - **\`${song.formattedDuration}\`**`).slice(0, 5)
		const msg = await message.channel.send({
			embed: {
				author: {
					name: 'Search Results',
					iconURL: message.guild.iconURL()
				},
				color: 'BLUE',
				fields: [
					{ name: `**__${found.length} songs found__**`, value: found },
					{ name: '**__Instructions__**', value: '**Type the number of your choice.\nYou can type `cancel` to cancel your search.**' }
				]
			}
		})
		/** Awaited Message */
		try {
			const choice = await message.channel.awaitMessages(m => m.author.id === message.author.id, {
				max: 1,
				time: 1e4,
				errors: ['time']
			})
			// no answer
			if (!choice.first()) {
				throw new Error(`Next time if you're just gonna let me waste my time don't use this command again okay?`)
			};
			// index parsing
			let index = parseInt(choice.first().content, 10);
			// check if a number
			if (isNaN(index) || index > results.length || index < 1) {
        throw new Error(`Cannot parse ${index} as number.`)
      };
			// play it.
			try {
				await bot.player.play(message, result[index - 1].url)
				try {
					await msg.delete()
				} catch(error) {
					logError('Command', 'Cannot delete search embed', error)
				}
			} catch(error) {
				logError('Command', 'Cannot play searched song', error)
			}
		} catch(error) {
			logError('Command', 'An error in message Collector', error)
			return 'You cancelled the search'
		}
	} catch(error) {
		logError('Command', 'Unable to search tracks', error)
	}
})