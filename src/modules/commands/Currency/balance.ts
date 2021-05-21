import { MessageOptions, GuildMember } from 'discord.js';
import { Command, Context } from 'rw/library';

export default class Currency extends Command {
	public constructor() {
		super('balance', {
			name: 'Balance',
			channel: 'guild',
			aliases: ['balance', 'bal', 'coins'],
			category: 'Currency',
			clientPermissions: ['EMBED_LINKS'],
			args: [{
				id: 'member',
				type: 'member',
				default: (ctx: Context) => ctx.member
			}]
		});
	}

	public async exec(ctx: Context<{ member: GuildMember }>): Promise<MessageOptions> {
		const isContextUser = ctx.author.id === ctx.args.member.user.id;
		const { props } = await ctx.getUser(ctx.args.member.user.id).currency();
		return { content: props.pocket.toLocaleString() };
	};
}