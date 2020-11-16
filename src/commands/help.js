import Command from '../classes/Command.js'
import { logError } from '../utils/logger.js'

export default new Command({
	name: 'help',
	aliases: ['command-info', 'cmd'],
	description: 'skip the current track',
	usage: '[command]',
	cooldown: 66000
}, async (bot, message, [cmd]) => {
	
	/** Import Commands */
	const command = cmd ? bot.commands.get(cmd.toLowerCase()) || bot.aliases.get(cmd.toLowerCase()) : false;
	
	/** Command Info */
	if (command) {
		return {
			title: `${bot.config.prefix[0]}${command.name}`,
			color: 'BLUE',
			fields: [
				{ name: 'Description', value: command.description },
				{ name: 'Triggers', value: `\`${command.aliases.join('`, `')}\``, inline: true },
				{ name: 'Usage', value: command.usage, inline: true },
				{ name: 'Permissions', value: `\`${command.permissions.join('`, `')}\``, inline: true }
			],
			footer: {
				text: `To view all commands, run ${bot.config.prefix[0]}help | To view per-command info, run ${bot.config.prefix[0]}help <command>`
			}
		}
	} else {
		return {
			title: bot.package.name,
			description: bot.package.description,
			color: 'BLUE',
			fields: [
				{ name: 'Music Commands', value: `\`${bot.commands.filter(c => c.music).map(c => c.name).join('`, `')}\`` },
				{ name: 'General Commands', value: `\`${bot.commands.filter(c => !c.music).map(c => c.name).join('`, `')}\`` }
			],
			footer: {
				text: `To view all commands, run ${bot.config.prefix[0]}help | To view per-command info, run ${bot.config.prefix[0]}help <command>`
			}
		}
	}
})