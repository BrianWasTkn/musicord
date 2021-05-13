import { GuildMember, MessageOptions } from 'discord.js';
import { Context } from 'lib/extensions';
import { Command } from 'lib/objects';
import { Embed } from 'lib/utility/embed';

export default class Currency extends Command {
	constructor() {
		super('postmeme', {
			name: 'Post Memes',
			aliases: ['postmeme', 'pm'],
			channel: 'guild',
			description: 'Post a meme on reddit.',
			category: 'Currency',
			cooldown: 45e3,
		});
	}

	async exec(ctx: Context) {
		const comp = ctx.client.handlers.item.modules.get('computer');
		const entry = await ctx.db.fetch();
		const inv = comp.findInv(entry.data.items, comp);

		if (inv.amount < 1) {
			return { replyTo: ctx.id, content: `LOL buy at least **1 ${comp.emoji} ${comp.name}** to post memes.` };
		}

		await entry.save(true);
		return comp.use(ctx);
	}
}
