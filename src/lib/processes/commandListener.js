export async function run() {
	this.on('message', async msg => {
		const { channel, guild } = msg;
		
		let prefix = false;
		for (const pref of this.config.bot.prefix) {
			if (msg.content.startsWith(pref)) prefix = pref;
		}
		if (!prefix) return;

		const args = msg.content.slice(prefix.length).trim().split(/ +/g);
		const cmd = args.shift();
		const command = this.commands.get(cmd) || this.commands.get(this.aliases.get(cmd));
		if (!command) {
			return msg.reply('Unknown command');
		} else {
			await command.execute({ ctx: this, msg, args });
		}

	})
}