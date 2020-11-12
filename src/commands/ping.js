import Command from '../classes/Command.js'

export default new Command({
	name: 'ping',
	aliases: ['pong'],
	description: 'check your shard\'s current latency',
	usage: 'command',
	music: false
}, async (bot, message) => {
	return `**Shard ${message.guild.shard.id}:** \`${message.guild.shard.ping}\``
})