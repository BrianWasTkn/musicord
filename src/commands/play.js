import Command from '../classes/Command.js'

export new Command({
	name: 'ping',
	aliases: ['pong'],
	description: 'check your shard\'s current latency',
	usage: '<...query | playlistURL | videoURL>',
	cooldown: 3e3
}, async (bot, message, args) => {
	if (!args) {
		const error = bot.utils.fancyText(bot.emotes.error, 'Missing Args', 'You need something to play.')
		return error
	}
	return `**Shard ${message.guild.shard.id}:** \`${message.guild.shard.ping}\``
})