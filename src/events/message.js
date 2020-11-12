export async function run(bot, message) {
	if (message.channel.type !== 'dm' && !message.author.bot) {
		const [cmd, ...args] = message.content.slice(bot.config.prefix.length).trim().split(' ');
		const command = bot.commands.get(cmd.toLowerCase()) || bot.aliases.get(cmd.toLowerCase());

		if (!command) {
			return;
		} else {
			try {
				await command.execute(bot, message, args);
			} catch(error) {
				await logError('Listener', `unable to execute "${command.name}"`, error)
			}
		}
	}
}