import { GuildMember, MessageOptions } from 'discord.js';
import { Context, ContextDatabase } from 'lib/extensions';
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

	exec(ctx: Context, entry: ContextDatabase) {
		const comp = ctx.client.handlers.item.modules.get('computer');
		const inv = comp.findInv(entry.data.items, comp);

		if (inv.amount < 1) {
			return { reply: { messageReference: ctx.id, failIfNotExists: false }, content: `LOL buy at least **1 ${comp.emoji} ${comp.name}** to post memes.` };
		}

		return comp.use(ctx);
	}
}
