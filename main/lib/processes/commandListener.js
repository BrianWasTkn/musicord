exports.run = async ctx => {
	ctx.on('message', async msg => {
		let prefix = '//';
		const { guild, channel, member } = msg;

		if (!msg.content.startsWith(prefix)) return;
		const args = msg.content.slice(prefix.length).trim().split(/ +/g);
		const cmd = args.shift();
		const command = ctx.cmds.get(cmd);

		if (command.permissions) {
			if (!member.permissions.has(command.permissions)) {
				return;
			}
		}

		if (command) {
			await command.execute({ ctx, msg, args });
		} else {
			await msg.reply('Unknown command.');
		}
	});
}