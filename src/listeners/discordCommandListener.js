import { log } from '../utils/logger.js'

export async function run(bot) {
	try {
		bot.on('message', async message => {
			if (message.channel.type !== 'dm' && !message.author.bot) {
				// Bot Prefix
				let prefix = false;
				for (const pref of bot.config.prefix) {
					if (message.content.toLowerCase().startsWith(pref)) prefix = pref;
				}
				if (!prefix) return;

				try {
					// Command and Args
					const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);
					const command = bot.commands.get(cmd.toLowerCase()) || bot.aliases.get(cmd.toLowerCase());
					if (!command) return;
					else try { 
						// Run the command
						await command.execute(bot.command, message, args); 
					} catch(error) { 
						log('listenerError', 'commandListener@exec_command', error)
					}
				} catch(error) {
					log('listenerError', 'commandListener@fetch_command', error);
				}
			}
		}).on('messageUpdate', async (oldMessage, newMessage) => {
			// TODO: able to run commands when editing a message.
			const message = newMessage, _ = oldMessage;
			if (message.channel.type !== 'dm' && !message.author.bot) {
				// Bot Prefix
				let prefix = false;
				for (const pref of bot.config.prefix) {
					if (message.content.toLowerCase().startsWith(pref)) prefix = pref;
				}
				if (!prefix) return;

				try {
					// Command and Args
					const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);
					const command = bot.commands.get(cmd.toLowerCase()) || bot.aliases.get(cmd.toLowerCase());
					if (!command) return;
					else try { 
						// Run the command
						await command.execute(bot.command, message, args); 
					} catch(error) { 
						log('listenerError', 'commandListener@exec_command', error)
					}
				} catch(error) {
					log('listenerError', 'commandListener@fetch_command', error);
				}
			}
		})

		log('main', 'Command Listener')
	} catch(error) {
		log('listenerError', 'commandListener', error)
	}
}