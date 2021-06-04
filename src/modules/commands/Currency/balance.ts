import { MessageOptions, GuildMember, MessageEmbedOptions } from 'discord.js';
import { Command, Context } from 'lava/index';

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
		const isContext = ctx.args.member.user.id === ctx.author.id;
		const entry = await ctx.currency.fetch(ctx.args.member.user.id);
		const balance = {
			Keys: entry.props.prem.toLocaleString(),
			Wallet: entry.props.pocket.toLocaleString(),
			Bank: entry.props.vault.toLocaleString() + (isContext ? `/${entry.props.space.toLocaleString()}` : '')
		};

		return { 
			embed: <MessageEmbedOptions> {
				author: { 
					name: `Balance — ${ctx.args.member.user.username}`, 
					iconURL: ctx.args.member.user.avatarURL({ dynamic: true }) 
				},
				color: Math.random() * 0xffffff, 
				description: Object.entries(balance)
					.map(([f, v]) => `**${f}:** ${v}`).join('\n'),
				footer: {
					text: ctx.client.user.username,
					icon_url: ctx.client.user.avatarURL()
				}
			}
		};
	};
}