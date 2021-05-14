import { MessageOptions } from 'discord.js';
import { Context } from 'lib/extensions';
import { Item } from 'lib/objects';

export default class PowerUp extends Item {
	constructor() {
		super('thicm', {
			category: 'Power-Up',
			sellable: true,
			buyable: true,
			usable: true,
			emoji: ':ok_hand:',
			name: 'Thicco Mode',
			cost: 30000,
			tier: 1,
			checks: ['time'],
			info: {
				short:
					'Blackjack rigged? Well if you want more coins, activate thicco mode.',
				long: 'Gives you +50% winnings on blackjack for 10 minutes.',
			},
		});
	}

	async use(ctx: Context): Promise<MessageOptions> {
		const { parseTime } = ctx.client.util;
		const time = 10 * 60 * 1e3;
		const expire = Date.now() + time;

		await ctx.db.updateInv(this.id, { expire }).removeInv(this.id).updateItems().save();
		return { replyTo: ctx.id, content: `**${this.emoji} You activated ${this.name.toLowerCase()}**\nYou've been granted a **50%** winnning power for blackjack for ${parseTime(time / 1e3)}!` };
	}
}
