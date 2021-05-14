import { Context } from 'lib/extensions';
import { Item } from 'lib/objects';
import { MessageOptions } from 'discord.js';

export default class Powerflex extends Item {
	constructor() {
		super('brian', {
			category: 'Power-Flex',
			sellable: true,
			buyable: true,
			usable: true,
			emoji: ':brown_heart:',
			name: "Brian's Heart",
			cost: 30000,
			tier: 2,
			checks: ['time'],
			info: {
				short: 'Grants you a great amount of luck on gamble and slots!',
				long:
					'Gives up to 50% multiplier and a 5% jackpot chance in slots for 10 minutes.',
			},
		});
	}

	async use(ctx: Context): Promise<MessageOptions> {
		const { randomNumber, sleep, parseTime } = this.client.util;
		const multi = randomNumber(10, 50), time = 10 * 60 * 1e3;
		const expire = Date.now() + time;

		await ctx.db.updateInv(this.id, { multi, expire }).removeInv(this.id).updateItems().save();
		return { replyTo: ctx.id, content: `${this.emoji} You now have a **${multi}% multiplier** and **5% jackpot chance** for ${parseTime(time / 1e3)}!` };
	}
}
