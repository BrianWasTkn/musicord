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
		const found = result.map((song, index) => `**#${index + 1}:** [**${song.name}**](${song.url}) - **\`${song.formattedDuration}\`**`)
		const msg = await message.channel.send({
			embed: {
				author: {
					name: 'Search Results',
					iconURL: message.guild.iconURL()
				},
				color: 'BLUE',
				fields: [
					{ name: `**__${result.length} songs found__**`, value: found },
					{ name: '**__Instructions__**', value: '**Type the number of your choice.\nYou can type `cancel` to cancel your search.**' }
				]
			}
		})
		/** Awaited Message */
		try {
			const choice = message.channel.awaitMessages(m => m.author.id === message.author.id, {
				max: 1,
				time: 3e4,
				errors: ['time']
			})
			if (!choice) throw Error('No Choice');
			let index = parseInt(choice, 10);
			await bot.player.play(message, results[index - 1].url)
		} catch(error) {
			logError('Command', 'An error in message Collector', error)
			return 'You cancelled the search'
		}
	} catch(error) {
		logError('Command', 'Unable to skip the current track', error)
	}
})