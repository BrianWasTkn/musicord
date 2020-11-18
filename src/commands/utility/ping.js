import Command from '../../classes/Command.js'

export default new Command({
	name: 'ping',
	aliases: ['pong'],
	description: 'check your shard\'s current latency',
	usage: 'command'
}, async (bot, message, args) => {
	return {
		title: message.guild.name,
		color: 'BLUE',
		fields: [
			{ name: 'Shard ID', value: message.guild.shard.id },
			{ name: 'Latency', value: `\`${message.guild.shard.ping}ms\`` }
		]
	}
})