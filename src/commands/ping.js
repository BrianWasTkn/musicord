import { Command } from '../lib/Command.js'

export default new Command({
	name: 'ping',
	aliases: ['pong'],
	cooldown: 3000
}, async (msg) => {
	return `This guild's latency is \`${msg.guild.shard.ping}ms\``;
});