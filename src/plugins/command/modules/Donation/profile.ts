import { Command, Context, GuildMemberPlus } from 'lava/index';

export default class extends Command {
	constructor() {
		super('donoProfile', {
			aliases: ['donoProfile', 'dprofile'], 
			clientPermissions: ['EMBED_LINKS'],
			name: 'Donation Profile',
			staffOnly: true,
			args: [
				{
					id: 'member',
					type: 'member',
					default: (c: Context) => c.member,
					unordered: true,
				},
				{
					id: 'page',
					type: 'number',
					default: 1,
					unordered: true,
				}
			]
		});
	}

	async exec(ctx: Context, { member, page }: { member: GuildMemberPlus, page: number; }) {
		const entry = await ctx.crib.fetch(ctx.author.id);
		const pages = ctx.client.util.paginateArray(entry.donos.map(d => ({
			name: `${d.module.name} Donations`,
			value: [
				`Donations Recorded: **${d.records.length.toLocaleString()}**`,
				`Amount Donated: **${d.amount.toLocaleString()}**`,
				`Average Donation: **${Math.round(d.records.reduce((p, r) => p + r, 0) / d.records.length).toLocaleString()}`
			].join('\n')
		})), 1);

		if (!pages[page - 1]) {
			return ctx.reply(`Page \`${page}\` doesn't exist.`).then(() => false);
		}

		return ctx.channel.send({ embed: {
			author: {
				name: `${member.user.username}'s donations`,
				iconURL: member.user.avatarURL({ dynamic: true })
			},
			color: member.roles.highest.color ?? 'BLUE',
			fields: pages[page - 1],
			footer: {
				text: `Page ${page} of ${pages.length}`
			}
		}}).then(() => false);
	}
}