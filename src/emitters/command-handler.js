export async function run() {
	this.on('message', async (msg) => {
		// Channel Types
		if (msg.channel.type === 'dm' || msg.author.bot) return;
		
		// Attach `args`, `label` and
		// `command` in our message object
		const args = msg.content
			.replace('<@!', '<@')
			.substring(this.config.prefix.length)
			.trim().split(/ +/g);
		const label = args.shift().toLowerCase();
		const command = this.commands.get(label) || this.aliases.get(label);

		if (!command) return;
		msg.args = args; msg.label = label; msg.command = command;
		// Thanks to `return await`, we
		// could resolve all promises
		return await command.execute(msg);
	});
}