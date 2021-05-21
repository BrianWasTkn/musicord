import { Context, ContextDatabase } from 'lib/extensions';
import { MessageOptions } from 'discord.js';
import { Command } from 'lib/objects';

export default class Currency extends Command {
	constructor() {
		super('burn', {
			name: 'Burn',
			aliases: ['burn'],
			channel: 'guild',
			description: "Burn a certain amount of coins if you're already max",
			category: 'Currency',
			cooldown: 6e4,
			args: [
				{
					id: 'amount',
					type: 'number'
				},
			],
		});
	}

	async exec(ctx: Context<{ amount: number }>, userEntry: ContextDatabase): Promise<MessageOptions> {
		const { data } = userEntry;
		const { amount } = ctx.args;

		if (!amount || amount < 1) {
			return { reply: { messageReference: ctx.id, failIfNotExists: false }, content: 'it has to be a real number greater than 0 yeah?' };
		}
		if (amount > data.pocket) {
			return { reply: { messageReference: ctx.id, failIfNotExists: false }, content: 'imagine burning money higher than your pocket lmao' };
		}

		await userEntry.addCd().removePocket(amount).save();
		return { reply: { messageReference: ctx.id, failIfNotExists: false }, content: `Burned **${amount.toLocaleString()}** coins from your pocket.` };
	}
}
