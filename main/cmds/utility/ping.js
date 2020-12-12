const Command = require('../../lib/command/Command.js');

module.exports = new Command(
	async ({ msg }) => {
		const { guild: shard, channel } = msg;
		return await channel.send(`here you go: \`${shard.ping}ms\``);
	}, {
		name: 'ping',
		aliases: ['pong'],
	}
)