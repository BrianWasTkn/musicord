import Command from '../classes/Command.js'

export default new Command({
	name: 'queue',
	aliases: ['q'],
	description: 'sends a list of songs on the queue of your server.',
	usage: '[clear]',
	cooldown: 3e3,
	music: true
}, async (bot, message, args) => {

	/** Check Playing State */
	const isPlaying = bot.player.isPlaying(message);
	if (!isPlaying) {
		return 'There\'s nothing playing in the queue.'
	}

	/** Check if args contains a flag to clear the queue */
	if (args.join(' ').includes('--clear')) {
		await bot.player.stop(message)
		return bot.utils.fancyText(bot.emotes.success, 'Queue Cleared', 'The queue has been cleared.')
	}

	/** Fetch Server Queue */
	const queue = bot.player.getQueue(message);
	if (!queue) {
		return 'There\'s nothing playing in the queue.'
	}

	/** Map Songs */
	const songs = queue ? queue.songs.map((song, index) => `**${index === 0 ? ':musical_note:' : `${index+1}.`}** [${song.name}](${song.url}) - \`${song.formattedDuration}\` `) : false;
	return {
		title: 'Server Queue',
		color: 'BLUE',
		fields: [
			{ name: '**__Now Playing:__**', value: songs[0] },
			{ name: '**__Server Queue:__**', value: songs[1] ? songs.slice(1).join('\n') : '**No more songs in queue.**' }
		]
	}
})