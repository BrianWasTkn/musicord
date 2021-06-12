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
				'Bank': `${entry.props.vault.toLocaleString()} ${
					user.id === ctx.author.id
						? `/ ${entry.props.space.toLocaleString()}` 
						: '' 
				}`
			})
				.map(([label, val]) => `**${label}:** ${val}`)
				.join('\n')
		}});
	}
}