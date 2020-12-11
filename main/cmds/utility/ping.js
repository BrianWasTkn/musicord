module.exports = {
	name: 'ping',
	aliases: ['pong'],
	callback: async ({ msg }) => {
		const { guild, channel } = msg;
		return await channel.send(`here you go: \`${guild.shard.ping}ms\``);
	}
}