import Command from '../../classes/Command/Utility.js'
import { simpleEmbed } from '../../utils/embed.js'

export default new Command({
	name: 'ping',
	aliases: ['pong'],
	description: 'check your shard\'s current latency',
	usage: 'command'
}, async message => {
	const shard = message.guild.shard;
	return simpleEmbed({
		title: 'Pingy Ping Pong',
		color: 'BLUE',
		text: `${bot.username} on **Shard ${shard.id}** has a delay of \`${shard.ping}ms\`.`
	});
})