import { MessageOptions } from 'discord.js';
import { Context } from 'lib/extensions';
import { Command } from 'lib/objects';
import bot from 'src/../package.json';

export default class Util extends Command {
	constructor() {
		super('version', {
			name: 'Version',
			aliases: ['version', 'ver'],
			channel: 'guild',
			description: 'Check the current version of this bot.',
			category: 'Utility',
		});
	}

	exec = (ctx: Context): MessageOptions => ({
		reply: { messageReference: ctx.id, failIfNotExists: false },
		content: `This instance of ${
			ctx.client.application.name
		} is running version \`${
			bot.version
		}\`.`
	});
}
