exports.run = async ctx => {
	ctx.on('message', async msg => {
		let prefix = '//';
		const { guild, channel } = msg;

		if (!msg.content.startsWith(prefix)) return;
		const args = msg.content.slice(prefix.length).trim().split(/ +/g);
		const cmd = args.shift();
		const command = ctx.commands.find(c => c.name === cmd);

		if (command) {
			await command.execute({ ctx, msg });
		} else {
			await msg.reply('Unknown command.');
		}
	});
}