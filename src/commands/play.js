import Command from '../classes/Command.js'

export default new Command({
	name: 'play',
	aliases: ['p'],
	description: 'play a song from soundcloud, youtube or from spotify and other sources.',
	usage: '<...query | playlistURL | videoURL>',
	cooldown: 3e3,
	music: true
}, async (bot, message, args) => {

	/** Check Playing State */
	const isPlaying = bot.player.isPlaying(message);
	if (!isPlaying) {
		return 'There\'s nothing playing in the queue.'
	}

	/** Missing Args (Bug?) */
	if (!args) {
		const error = bot.utils.fancyText(bot.emotes.error, 'Missing Args', 'You need something to play.')
		return error
	}

	/** Play */
	try {
		await bot.player.play(message, args.join(' '))
	} catch(error) {
		console.error(error)
	}
})