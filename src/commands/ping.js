import Command from '../classes/Command.js'

export default new Command({
	name: 'ping',
	aliases: ['pong'],
	description: 'check your shard\'s current latency',
	usage: 'command'
}, async (bot, message, args) => {
	return `**Shard ${message.guild.shard.id}:** \`${message.guild.shard.ping}\``
})