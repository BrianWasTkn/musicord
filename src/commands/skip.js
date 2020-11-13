import Command from '../classes/Command.js'

export default new Command({
	name: 'skip',
	aliases: ['playnext'],
	description: 'skip the current track',
	usage: 'command',
	cooldown: 3e3,
	music: true
}, async (bot, message, args) => {
	
	/** Check Playing State */
	const isPlaying = bot.player.isPlaying(message);
	if (!isPlaying) {
		return 'There\'s nothing playing in the queue.'
	}

	/** Do the thing */
	const queue = await bot.player.skip(message);
	return {
		title: `**__${bot.emotes.success} Track Skipped__**`,
		color: 'GREEN'
	}
})