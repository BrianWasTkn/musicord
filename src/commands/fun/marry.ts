import { GuildMember, MessageOptions } from 'discord.js';
import { MessagePlus } from '@lib/extensions/message';
import { UserPlus } from '@lib/extensions/user';
import { Command } from '@lib/handlers/command';

export default class Fun extends Command {
	constructor() {
		super('marry', {
			aliases: ['marry'],
			channel: 'guild',
			description: 'Marry someone!',
			category: 'Fun',
			args: [
				{
					id: 'enemy',
					type: 'user',
					default: null
				}
			]
		})
	}

	async exec(msg: MessagePlus, args: {
		someone: GuildMember
	}): Promise<MessageOptions> {
		const { someone } = args;

		return { content: 'Lmao' };
	}
}