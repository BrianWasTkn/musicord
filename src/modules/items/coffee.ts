import { Context } from 'lib/extensions';
import { MessageOptions } from 'discord.js';
import { Item } from 'lib/objects';

export default class PowerUp extends Item {
	constructor() {
		super('coffee', {
			category: 'Power-Up',
			sellable: true,
			buyable: true,
			usable: true,
			emoji: ':hot_face:',
			name: "Badddie's Coffee",
			cost: 120000,
			tier: 2,
			checks: ['time'],
			info: {
				short: 'Boosts your multiplier at a massive rate.',
				long: 'Gives up to 100% multiplier for 5 minutes.',
			},
		});
	}

	async use(ctx: Context): Promise<MessageOptions> {
		const { randomNumber, sleep, parseTime } = this.client.util;
		const { data } = ctx.db, multi = randomNumber(10, 100);
		const time = 5 * 60 * 1e3, expire = Date.now() + time;

		await ctx.db.updateInv(this.id, { multi, expire }).removeInv(this.id).updateItems().save();
		return { replyTo: ctx.id, content: `${this.emoji} Your coffee granted you a **${multi}% multiplier** valid for ${parseTime(time / 1e3)}!` };
	}
}
