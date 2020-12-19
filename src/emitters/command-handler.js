export async function run() {
	this.on('message', async (msg) => {
		// Channel Types
		if (msg.channel.type === 'dm' || msg.author.bot) return;
		
		// Attach `args`, `label` and
		// `command` in our message object
		msg.args = msg.content
			.replace('<@!', '<@')
			.substring(this.config.prefix.length)
			.trim().split(/ +/g);
		msg.label = (msg.args.shift())
			.toLowerCase();
		msg.command = this.commands.get(msg.label) || this.aliases.get(msg.label);

		if (!msg.command) return;
		// Thanks to `return await`, we
		// could resolve all promises
		return await msg.command.execute(msg);
	});
}