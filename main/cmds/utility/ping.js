const Command = require('../../lib/command/Command.js');

module.exports = new Command({
	name: 'ping',
	aliases: ['pong'],
	description: 'Checks my latency for this server.'
}, async ({ msg }) => {
	const { guild, channel } = msg;
	return await channel.send(`here you go: \`${guild.shard.ping}ms\``);
});