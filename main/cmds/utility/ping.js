const Command = require('../../lib/command/Command.js');

module.exports = new Command(
	async ({ msg }) => {
		const { guild, channel } = msg;
		return await channel.send(`here you go: \`${guild.shard.ping}ms\``);
	}, {
		name: 'ping',
		aliases: ['pong'],
	}
)