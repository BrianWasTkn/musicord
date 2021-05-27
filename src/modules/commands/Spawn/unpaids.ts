import { MessageOptions, GuildMember } from 'discord.js';
import { Command, Context } from 'src/library';

export default class Spawn extends Command {
	public constructor() {
		super('unpaids', {
			name: 'Unpaids',
			channel: 'guild',
			aliases: ['unpaids'],
			category: 'Spawn',
			clientPermissions: ['EMBED_LINKS'],
			args: [{
				id: 'member',
				type: 'member',
				default: (ctx: Context) => ctx.member
			}]
		});
	}

	public async exec(ctx: Context<{ member: GuildMember }>): Promise<MessageOptions> {
		const entry = await ctx.spawn.fetch(ctx.args.member.user.id);
		const balance = {
			'Remaining Unpaids': entry.props.unpaids.toLocaleString(),
			'Events Joined': entry.props.joined.toLocaleString(),
		};

		return { 
			embed: {
				author: { 
					name: `Spawn Balance — ${ctx.args.member.user.username}`, 
					iconURL: ctx.args.member.user.avatarURL({ dynamic: true }) 
				},
				color: Math.random() * 0xffffff, 
				description: Object.entries(balance).map(([f, v]) => `**${f}:** ${v}`).join('\n'),
				footer: {
					text: ctx.client.user.username,
					icon_url: ctx.client.user.avatarURL()
				}
			}
		};
	};
}