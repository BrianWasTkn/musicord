import Command from '../classes/Command.js'

export default new Command({
	name: 'play',
	aliases: ['p'],
	description: 'play a song from soundcloud, youtube or from spotify and other sources.',
	usage: '<...query | playlistURL | videoURL>',
	cooldown: 3e3,
	music: true
}, async (bot, message, args) => {
	if (!args) {
		const error = bot.utils.fancyText(bot.emotes.error, 'Missing Args', 'You need something to play.')
		return error
	}
	
	await bot.player.play(message, args.join(' '))
})