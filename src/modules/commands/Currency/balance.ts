import { MessageOptions, GuildMember } from 'discord.js';
import { Command, Context } from 'src/library';

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
		const { user } = ctx.args.member;
		const entry = await ctx.getUser(user.id).currency();
		const balance = {
			Pocket: entry.props.pocket.toLocaleString(),
			Vault: entry.props.vault.toLocaleString()
		};

		return { 
			content: 'Lava is being sanitized for more shit to come. Your data won\'t be lost. Stay tuned!',
			embed: {
				author: { 
					name: `${user.username}'s balance`, 
					iconURL: user.avatarURL({ dynamic: true }) 
				},
				color: Math.random() * 0xffffff, 
				description: Object.entries(balance)
					.map(([f, v]) => `**${f}:** ${v}`).join('\n'),
				footer: {
					name: ctx.client.user.username,
					icon_url: ctx.client.user.avatarURL()
				}
			}
		};
	};
}