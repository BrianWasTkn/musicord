import { MessageOptions, MessageEmbedOptions } from 'discord.js';
import { Command, Context, GuildMemberPlus } from 'lava/index';

export default class extends Command {
	constructor() {
		super('balance', {
			aliases: ['balance', 'bal'],
			description: 'Check yours or someone elses balance.',
			clientPermissions: ['EMBED_LINKS'],
			name: 'Balance',
			args: [{
				id: 'member',
				type: 'member',
				default: (c: Context) => c.member,
				description: 'The user you wanna check the balance for.',
			}]
		});
	}

	async exec(ctx: Context, args: { member: GuildMemberPlus }): Promise<MessageOptions> {
		const entry = await ctx.currency.fetch(args.member.user.id);
		const { user } = args.member;

		if (entry.props.pocket <= 0) {
			await entry.addPocket(ctx.client.util.randomNumber(1, 5) * 1e6);
		}

		return { embed: <MessageEmbedOptions> {
			title: `${user.username}'s balance`,
			color: ctx.client.util.randomColor(),
			description: Object.entries({
				'Wallet': entry.props.pocket.toLocaleString(),
				'Bank': `${entry.props.vault.amount.toLocaleString()}${
					user.id === ctx.author.id
						? `/${entry.props.space.toLocaleString()}` 
						: '' 
				}`
			})
				.map(([label, val]) => `**${label}:** ${val}`)
				.join('\n')
		}};
	}
}