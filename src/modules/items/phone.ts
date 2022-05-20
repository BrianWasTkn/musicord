import { MessageOptions } from 'discord.js';
import { Context } from 'lib/extensions';
import { Item } from 'lib/objects';

export default class Tool extends Item {
	constructor() {
		super('phone', {
			category: 'Tool',
			sellable: true,
			buyable: true,
			usable: true,
			emoji: ':mobile_phone:',
			name: "Cellphone",
			cost: 69420,
			tier: 1,
			info: {
				short: 'Call the cops!',
				long:"Report an ongoing bankrobbery.",
			},
		});
	}

	async use(ctx: Context): Promise<MessageOptions> {
		const { currencyHeists, randomNumber } = ctx.client.util;
		const collector = currencyHeists.get(ctx.guild.id);
		if (collector.victim !== ctx.author.id) {
			const fine = Math.round(randomNumber(0, ctx.db.data.pocket * 0.2));
			await ctx.db.removePocket(fine).save();
			return { reply: { messageReference: ctx.id }, content: `Heck, there are no ongoing bank robberies here. We sent our police department to hunt and fine you **${fine.toLocaleString()}** coins.` };
		}
		return { reply: { messageReference: ctx.id, failIfNotExists: false }, content: `Nice.` };
	}
}
