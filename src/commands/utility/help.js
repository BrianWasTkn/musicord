import Command from '../../classes/Command/Utility.js'
import { log } from '../../utils/logger.js'

export default new Command({
	name: 'help',
	aliases: ['command-info', 'cmd'],
	description: 'skip the current track',
	usage: '[command]'
}, async (bot, message, [query]) => {
	const command = query ? bot.commands.get(query.toLowerCase()) || bot.aliases.get(query.toLowerCase()) : false;
	const category = !command && ['Music', 'Filter', 'Utility', 'Owner'].map(cat => cat.toLowerCase()).includes(query.toLowerCase()) 
	? query : false;
	
	const formatCommand = (command) => ({
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
	});

	const formatCategory = (category, commands) => ({
		title: category.charAt(0).toUpperCase() + category.split('').slice(1).join(),
		value: `\`${commands.join('`, `')}\``,
		footer: { text: commands.array().length === 1 ? 'command' : 'commands' }
	})

	/** command */
	if (command) {
		/** command PRIVATE */
		if (command.private && bot.developers.includes(message.author.id)) {
			return formatCommand(command);
		} else if (!command.private) {
			return formatCommand(command);
		}
	} 
	/** category */
	else if (category) {
		const commands = bot.commands.filter(c => c.category.toLowerCase() === query.toLowerCase());
		return formatCategory(category, commands);
	}
	/** all */
	else {
		return {
			title: bot.user.username,
			description: bot.package.description,
			color: 'BLUE',
			fields: ['Music', 'Filter', 'Utility', 'Owner'].map(cat => ({
				name: `${cat} Commands`,
				value: bot.commands.filter(cmd => cmd.category === cat)
			}))
		}
	}
})