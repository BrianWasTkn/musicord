import Command from '../classes/Command.js'

export default new Command({
	name: 'pause',
	aliases: ['freeze'],
	description: 'pause the current playing track',
	usage: 'command',
	cooldown: 3e3,
	music: true
}, async (bot, message, args) => {

	const playing = bot.player.isPlaying(message),
	paused = bot.player.isPaused(message);

	if (playing) {
		if (paused) {
			return bot.utils.fancyText(bot.emotes.error, 'Paused', 'The player is already paused');
		}
		const queue = await bot.player.pause(message);
		return bot.utils.fancyText(bot.emotes.success, 'Player Paused', 'The player has been successfully paused.')
	} else {
		return 'Nothing is playing lol.'
	}
})