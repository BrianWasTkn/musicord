import { Context, ContextDatabase } from 'lib/extensions';
import { MessageOptions } from 'discord.js';
import { Command } from 'lib/objects';

export default class Currency extends Command {
	constructor() {
		super('hourly', {
			name: 'Hourly',
			aliases: ['hourly', '1h'],
			channel: 'guild',
			description: 'Claim your hourly coins.',
			category: 'Currency',
			cooldown: 1e3 * 60 * 60,
		});
	}

	async exec(ctx: Context, userEntry: ContextDatabase): Promise<MessageOptions> {
		const won = 5000;
		await userEntry.addCd().addPocket(won).save();
		
		return {
			embed: {
				title: `Here are your hourly coins, ${ctx.author.username}`,
				description: `**${won.toLocaleString()}** were placed in your pocket.`,
				color: 'RANDOM',
				footer: { text: `Thanks for supporting this trash bot!` },
			},
		};
	}
}