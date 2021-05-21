import { Context } from 'lib/extensions';
import { MessageOptions } from 'discord.js';
import { Item } from 'lib/objects';

export default class PowerUp extends Item {
	constructor() {
		super('crazy', {
			category: 'Power-Up',
			sellable: true,
			buyable: true,
			usable: true,
			emoji: ':beers:',
			name: "Crazy's Alcohol",
			cost: 25000,
			tier: 2,
			checks: ['time'],
			info: {
				short:
					'Grants you a great amount of luck while playing the slot machine!',
				long:
					"Gives you a 5% chance of getting jackpot on slots! Only lasts for 69 seconds.",
			},
		});
	}

	async use(ctx: Context): Promise<MessageOptions> {
		const { parseTime } = ctx.client.util;
		const time = 69 * 1000, expire = Date.now() + time;
		await ctx.db.updateInv(this.id, { expire }).removeInv(this.id).updateItems().save();
		return { reply: { messageReference: ctx.id, failIfNotExists: false }, content: `You now have a **15%** jackpot chance for ${parseTime(time / 1e3)}!` };
	}
}
