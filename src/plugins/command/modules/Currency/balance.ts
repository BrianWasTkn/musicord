import { MessageOptions, MessageEmbedOptions } from 'discord.js';
import { Command, Context, GuildMemberPlus } from 'src/library';

export default class CurrencyCommand extends Command {
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

	async exec(ctx: Context<{ member: GuildMemberPlus }>): Promise<MessageOptions> {
		const { pocket, vault, space } = await ctx.currency
			.fetch(ctx.args.member.user.id).then(d => d.props);
		const { user } = ctx.args.member;

		return { embed: <MessageEmbedOptions> {
			title: `${user.id}'s balance`,
			color: ctx.client.util.randomColor(),
			description: Object.entries({
				'Wallet': pocket.toLocaleString(),
				'Bank': `${vault.toLocaleString()}${
					user.id === ctx.author.id
						? `/${space.toLocaleString()}` 
						: '' 
				}`
			})
				.map(([label, val]) => `**${label}:** ${val}`)
				.join('\n')
		}};
	}
}