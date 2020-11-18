import { inspect } from 'util';
import Command from '../../classes/Command.js';

export default new Command({
	name: 'dependencies',
	aliases: ['deps'],
	description: 'Musicord dependencies.',
	permissions: ['ADMINISTRATOR'],
	usage: 'command',
	cooldown: 3e3
}, async (bot, message, args) => {

	return {
		title: `${bot.user.username}`,
		thumbnail: bot.user.avatarURL({ dynamic: true }),
		description: `${bot.user.username} has the following dependencies to keep this bot up and running. They're also responsible for the behavior of how functions and methods work for commands, listeners and the player itself.`,
		fields: [
			{ name: `${bot.dependencies.length} total dependencies`, value: `\`${bot.dependencies.join('`, `')}\`` }
		]
	}

})