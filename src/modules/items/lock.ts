import { Context } from 'lib/extensions';
import { MessageOptions } from 'discord.js';
import { Item } from 'lib/objects';

export default class Tool extends Item {
	constructor() {
		super('lock', {
			category: 'Tool',
			sellable: true,
			buyable: true,
			usable: true,
			emoji: ':lock:',
			name: "Padlock",
			cost: 2000,
			tier: 2,
			checks: ['time'],
			info: {
				short: 'Increase protection from robbers!',
				long: 'Gives you protection against pesky robbers and heisters for 12 hours!',
			},
		});
	}

	async use(ctx: Context): Promise<MessageOptions> {
		const { parseTime } = ctx.client.util;
		const time = 12 * 60 * 60 * 1e3;
		const expire = Date.now() + time;

		await ctx.db.updateInv(this.id, { expire }).removeInv(this.id).updateItems().save();
		return { replyTo: ctx.id, content: `${this.emoji} Your **${this.name}** has been activated for **${parseTime(time / 1e3)}** so be careful!` };
	}
}
