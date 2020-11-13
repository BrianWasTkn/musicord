import Command from '../classes/Command.js'

export default new Command({
	name: 'ping',
	aliases: ['pong'],
	description: 'check your shard\'s current latency',
	usage: 'command'
}, async (bot, message, args) => {
	return {
		author: {
			name: message.guild.name,
			icon_url: message.guild.iconURL()
		},
		color: 'BLUE',
		fields: [
			{ name: 'Shard ID', value: message.guild.shard.id },
			{ name: 'Latency', value: `\`${message.guild.shard.ping}ms\`` }
		],
		footer: {
			text: message.author.tag,
			icon_url: message.author.avatarURL()
		}
	}
})