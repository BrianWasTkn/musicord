import { Command, Context } from 'lava/index';

export default class extends Command {
	constructor() {
		super('postmeme', {
			aliases: ['postmeme', 'pm'],
			cooldown: 45e3,
			description: 'Post a meme on reddit.',
			name: 'Post Meme',
		});
	}

	async exec(ctx: Context) {
		const entry = await ctx.currency.fetch(ctx.author.id);
		const comp = entry.items.get('computer');

		if (comp.owned < 1) {
			return ctx.reply(`LOL buy at least **1 ${comp.module.emoji} ${comp.module.name}** to post memes.`).then(() => false);
		}

		return comp.module.use(ctx, entry).then(() => true);
	}
}
