exports.run = async message => {
	const { author, member, guild, channel } = message;

	if (author.bot) return;
	if (!message.content
		.toLowerCase()
		.startsWith(this.config.prefix.toLowerCase())
	) {
		return;
	}

	let [cmd, ...args] = message.content.split(client.config.prefix.length).trim().split(/ +/g);
	cmd = cmd.toLowerCase();
	let command = this.commands.get(cmd) || this.commands.get(this.aliases.get(cmd));

	if (client.config.dev) {
		if (!client.developers.includes(author.id)) return;

	}
}