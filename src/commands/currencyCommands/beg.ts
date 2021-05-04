import { MessageOptions } from 'discord.js';
import { Command, Item } from 'lib/objects';
import { Context } from 'lib/extensions';
import config from 'config/index';

export default class Currency extends Command {
	constructor() {
		super('beg', {
			name: 'Beg',
			aliases: ['beg', 'gimme'],
			channel: 'guild',
			description: 'Gives you a random amount of coins from 100k to 1m coins',
			category: 'Currency',
			cooldown: 6e4,
		});
	}

	async exec(ctx: Context): Promise<string | MessageOptions> {
		const { db, util, handlers } = this.client,
			{ modules: items } = handlers.item,
			userEntry = await ctx.db.fetch(),
			data = userEntry.data;

		if (data.pocket >= config.currency.maxPocket) {
			return "You're already rich stop begging already.";
		}

		const odds = Math.random();
		switch (true) {
			case odds >= 0.9:
				const item = items.filter((i) => !i.premium || i.cost < 30e6).random();
				const amount = util.randomNumber(1, 10);
				await userEntry.addCd().addInv(item.id, amount).save();
				return {
					embed: {
						description: `WOWSIES! You got **${amount} ${item.emoji} ${item.name
							}**${amount > 1 ? 's' : ''} you're so lucky`,
						author: { name: ctx.client.user.username },
						color: 'ORANGE',
					},
					replyTo: ctx,
				};
			case odds >= 0.5:
				const won = util.randomNumber(10, 5000);
				await userEntry.addCd().addPocket(won).calcSpace().updateItems().save();
				return {
					embed: {
						description: `"I promised I won't give you up so here's ${won.toLocaleString()} coins"`,
						author: { name: 'Rich Ashley' },
						color: 'ORANGE',
					},
					replyTo: ctx,
				};
			default:
				await userEntry.addCd().save();
				return {
					embed: {
						description: '"no because you\'re an idiot"',
						author: { name: ctx.client.user.username },
						color: 'ORANGE',
					},
					replyTo: ctx,
				};
		}
	}
}
