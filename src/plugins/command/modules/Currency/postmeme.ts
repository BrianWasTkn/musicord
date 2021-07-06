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
		const comp = entry.props.items.get('computer');

		if (comp.isOwned()) {
			return ctx.reply(`You need **1 ${comp.module.emoji} ${comp.module.name}** to post memes.`).then(() => false);
		}

		return comp.module.use(ctx, entry).then(() => true);
	}
}
