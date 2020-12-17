exports.run = async ctx => {
	ctx.on('message', async msg => {
		const { guild, channel, member } = msg;

		let prefix = `${ctx.config.main.prefix} `;
		if (!msg.content.startsWith(prefix)) {
			return;
		}

		let [command, ...args] = msg.content.slice(prefix.length).trim().split(/ +/g);
		command = ctx.cmds.get(command) || ctx.cmdAliases.get(command);

		if (command) {
			await command.execute({ ctx, msg, args });
		}
	});
}