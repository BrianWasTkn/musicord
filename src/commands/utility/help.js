import Command from '../../classes/Command/Utility.js'
import { log } from '../../utils/logger.js'
import { simpleEmbed } from '../../utils/embed.js'

export default new Command({
	name: 'help',
	aliases: ['command-info', 'cmd'],
	description: 'skip the current track',
	usage: '[command]'
}, async (bot, message, [query]) => {
	// check if query is a command or a category.
	query = query.toLowerCase();
	const command = query ? (bot.commands.get(query) || bot.aliases.get(query)) : false;
	const category = !command && ['Music', 'Filter', 'Utility', 'Owner'].some(cat => cat.toLowerCase().includes(query)) ? query : false;
	// display command info
	const formatCommand = (command) => {
		return {
			title: `${bot.config.prefix[0]}${command.name}`,
			color: 'BLUE',
			fields: [
				{ name: 'Description', value: command.description },
				{ name: 'Aliases', value: `\`${command.aliases.join('`, `')}\``},
				{ name: 'Permissions', value: `\`${command.permissions.join('`, `')}\`` },
				{ name: 'Usage', value: `\`${command.usage}\`` },
				{ name: 'Cooldown', value: command.cooldown },
				{ name: 'Category', value: command.category },
				{ name: 'Premium', value: 'false' }
			],
			footer: { text: `Thanks for using ${bot.user.username}! ♥` }
		}
	};
	// display category info
	const formatCategory = (category, commands) => {
		return {
			title: category.charAt(0).toUpperCase() + category.split('').slice(1).join(),
			value: `\`${commands.join('`, `')}\``,
			footer: { text: commands.array().length === 1 ? 'command' : 'commands' }
		}
	}

	/** command */
	if (command) {
		/** non-dev command */
		if (!bot.developers.includes(message.author.id)) {
			/** command is private */
			if (command.private) return;
			else return formatCommand(command);
		}
		/** dev command */
		if (bot.developers.includes(message.author.id)) {
			return formatCommand(command);
		}
	} 
	/** category */
	else if (category) {
		const commands = bot.commands.filter(c => c.category.toLowerCase() === query);
		return formatCategory(category, commands);
	}
	/** all */
	else if (!query || (!command && !category)) {
		// Developer Embed
		if (!bot.developers.includes(message.author.id)) {
			return {
				title: bot.user.username,
				description: bot.package.description,
				color: 'BLUE',
				fields: ['Music', 'Filter', 'Utility', 'Owner'].map(cat => ({
					name: `${cat} Commands`,
					value: bot.commands.filter(cmd => cmd.category.toLowerCase() === cat)
				}))
			}
		}
		// Normie Embed
		else {
			return {
				title: bot.user.username,
				description: bot.package.description,
				color: 'BLUE',
				fields: ['Music', 'Filter', 'Utility'].map(cat => ({
					name: `${cat} Commands`,
					value: bot.commands.filter(cmd => cmd.category.toLowerCase() === cat)
				}))
			}
		}
	}
	/** none */
	else {
		return simpleEmbed(message, `No command or category found for "${query}"`);
	}
})