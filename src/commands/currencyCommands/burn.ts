import { MessageOptions } from 'discord.js';
import { Context } from 'lib/extensions';
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

	async exec(ctx: Context<{ amount: number }>): Promise<MessageOptions> {
		const userEntry = await ctx.db.fetch(), { data } = userEntry;
		const { amount = Math.round(data.pocket / 2) } = ctx.args;

		if (!amount || amount < 1) {
			return { content: 'it has to be a real number greater than 0 yeah?' };
		}
		if (amount > data.pocket) {
			return { content: 'imagine burning money higher than your pocket lmao' };
		}

		await userEntry.addCd().removePocket(amount).save(true);
		return { content: `Burned **${amount.toLocaleString()}** coins from your pocket.` };
	}
}
