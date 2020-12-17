exports.run = async ctx => {
	ctx.on('message', async msg => {
		const { guild, channel, member } = msg;

		let self = guild.members.cache.get(ctx.user.id);
		let mention = `<@${self.nickname ? '!' : ''}${self.user.id}>`;
		let mentioned = msg.content.startsWith(mention);
		let prefixLength = (mentioned ? mention : ctx.config.main.prefix).length + 1;

		if (
			!msg.content.startsWith(ctx.config.main.prefix + ' ')
		) {
			return;
		}

		let [command, ...args] = msg.content.slice(prefixLength).trim().split(/ +/g);
		command = ctx.cmds.get(cmd) || ctx.cmdAliases.get(cmd);

		if (command) {
			await command.execute({ ctx, msg, args });
		}
	});
}