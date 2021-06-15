import { Command, Context, GuildMemberPlus, Currency } from 'lava/index';
import { MessageOptions, MessageEmbedOptions } from 'discord.js';

export default class extends Command {
	constructor() {
		super('balance', {
			aliases: ['balance', 'bal'],
			clientPermissions: ['EMBED_LINKS'],
			description: 'Check yours or someone elses balance.',
			name: 'Balance',
			args: [{
				id: 'member',
				type: 'member',
				default: (c: Context) => c.member,
				description: 'The user you who you wanna check the balance.',
			}]
		});
	}

	async exec(ctx: Context, args: { member: GuildMemberPlus }) {
		const entry = await ctx.currency.fetch(args.member.user.id);
		const { user } = args.member;

		// temporary coz testing owo
		if (entry.props.pocket <= 0) {
			await entry.addPocket(ctx.client.util.randomNumber(1, 5) * 1e6).save();
		}

		return ctx.channel.send({ embed: <MessageEmbedOptions> {
			title: `${user.username}'s balance`,
			color: ctx.client.util.randomColor(),
			description: Object.entries({
				'Wallet': entry.props.pocket.toLocaleString(),
				'Bank': `${entry.props.vault.toLocaleString()}${
					user.id === ctx.author.id
						? `/${entry.props.space.toLocaleString()}` 
						: '' 
					}`,
				'Items': `${
						entry.items.reduce((p, c) => p + c.owned, 0).toLocaleString()
					}/${
						Currency.MAX_INVENTORY.toLocaleString()
					}`
			})
				.map(([label, val]) => `**${label}:** ${val}`)
				.join('\n')
		}});
	}
}