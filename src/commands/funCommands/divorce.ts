import { Context, ContextDatabase, UserPlus } from 'lib/extensions';
import { MessageOptions } from 'discord.js';
import { Command } from 'lib/objects';

export default class Fun extends Command {
	constructor() {
		super('divorce', {
			name: 'Divorce',
			aliases: ['divorce'],
			channel: 'guild',
			description: 'Divorce your husband or wife!',
			category: 'Fun',
		});
	}

	async exec(ctx: Context): Promise<MessageOptions> {
		const meEntry = await ctx.db.fetch();
		const me = meEntry.data;

		if (!me.marriage.id) {
			return {
				replyTo: ctx.id,
				content: "You're not even married to somebody",
			};
		}

		const husOrWif = (await this.client.users.fetch(me.marriage.id)) as UserPlus;
		await ctx.send({ content: `Are you sure you about that? Type \`(y / n)\` in 30 seconds.` });
		const resp = (await ctx.awaitMessage(ctx.author.id, 3e4)).first();
		if (!resp || !['yes', 'y'].includes(resp.content.toLowerCase())) {
			return { replyTo: ctx.id, content: 'Well ok then' };
		}

		const divEntry = await (new ContextDatabase(ctx)).fetch(husOrWif.id);
		await divEntry.divorce().save();
		await meEntry.divorce().save();

		return {
			replyTo: ctx.id,
			content: `**:white_check_mark: Divorce against ${husOrWif.tag} successful.**`,
		};
	}
}
