import { Command } from '../../lib/command/Command.js'

export function () {
	return new Command(
		async ({ ctx, msg, args }) => {
			const { channel, guild: shard } = msg;
			await channel.send(`here you go: \`${shard.ping}ms\``)
	}, {
		name: 'ping',
		aliases: ['pong'],
		description: 'View my latency for this guild.',
		category: 'Utility',
	}, {
		cooldown: 5000,
		rateLimit: 2,
		enabled: true,
		permLevel: 0,
		nsfw: false
	});
}