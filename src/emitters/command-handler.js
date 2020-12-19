export async function run() {
	this.on('message', async (msg) => {
		if (msg.channel.type === 'dm' || msg.author.bot) return;
		
		const args = msg.content
			.replace('<@!', '<@')
			.substring(this.config.prefix.length)
			.trim().split(/ +/g);
		const cmd = (args.shift())
			.toLowerCase();
		const command = this.commands.get(cmd) || this.aliases.get(cmd);

		if (!command) return;
		return await command.execute({ Bot: this, msg, args });
	});
}