import { log } from '../utils/logger.js'

export async function run(bot) {
	try {
		bot.on('message', async message => {
			if (message.channel.type !== 'dm' && !message.author.bot) {

				let prefix = false;
				for (const pref of bot.config.prefix) {
					if (message.content.toLowerCase().startsWith(pref)) prefix = pref;
				}
				if (!prefix) return;

				const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);
				const command = bot.commands.get(cmd.toLowerCase()) || bot.aliases.get(cmd.toLowerCase());
				if (!command) return;
				try {
					await command.execute(bot, command, message, args);
				} catch(error) {
					log('listenerError', 'commandListener@error', error)
				}
			}
		}).on('messageEdit', async (oldMessage, newMessage) => {
			// TODO: able to run commands when edit a message.
		})
		log('main', 'Command Listener')
	} catch(error) {
		log('listenerError', 'commandListener', error)
	}
}