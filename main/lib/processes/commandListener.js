exports.run = async ctx => {
	ctx.on('message', async msg => {
		const { guild, channel, member } = msg;

		let prefix = false;
		for (const pref of ctx.config.main.prefix) {
			if (msg.content.toLowerCase().startsWith(pref)) prefix = pref;
		}
		if (!prefix) return;

		const args = msg.content.slice(prefix.length).trim().split(/ +/g);
		const cmd = args.shift();
		const command = ctx.cmds.get(cmd) || ctx.cmdAliases.get(cmd);

		if (command) {
			await command.execute({ ctx, msg, args });
		} else {
			await msg.reply('Unknown command.');
		}
	});
}