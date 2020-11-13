import Command from '../classes/Command.js'

export default new Command({
	name: 'queue',
	aliases: ['q'],
	description: 'sends a list of songs on the queue of your server.',
	usage: '[clear]',
	cooldown: 3e3,
	music: true
}, async (bot, message, args) => {
	
	if (['clear'].includes(args.join(' '))) {
		await bot.player.stop(message)
		return bot.utils.fancyText(bot.emotes.success, 'Queue Cleared', 'The queue has been cleared.')
	}

	const queue = bot.player.getQueue(message);
	const songs = queue.songs.map((song, index) => `**${index === 0 ? ':musical_note:' : `${index+1}.`} [${song.name}](${song.url}) - \`${song.formattedDuration}\` `);

	return {
		title: 'Server Queue',
		color: 'BLUE',
		fields: [
			{ name: '**__Now Playing:__**', value: songs[0] },
			{ name: '**__Server Queue:__**', value: songs[1] ? songs.slice(1).join('\n') : '**No more songs in queue.**' }
		]
	}
})