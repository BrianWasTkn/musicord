import { logError, logInit } from '../utils/logger.js'

export async function run(bot) {
	try {
		bot.on('message', async message => {
			if (message.channel.type !== 'dm' && !message.author.bot) {

				let prefix = false;
				for (const pref of bot.config.prefix) {
					if (message.content.toLowerCase().startsWith(pref)) prefix = pref;
				}
				if (!prefix) return;

				const [cmd, ...args] = message.content.slice(prefix.length).split(' ');
				const command = bot.commands.get(cmd.toLowerCase()) || bot.aliases.get(cmd.toLowerCase());

				if (!command) {
					return;
				} else {
					try {
						await command.execute(bot, command, message, args);
					} catch(error) {
						await logError('Listener', `unable to execute "${command.name}"`, error)
					}
				}
			}
		})
		logInit('Musicord', 'Command Listener Loaded')
	} catch(error) {
		logError('Listener', 'Unable to process the command listener', error)
	}
}