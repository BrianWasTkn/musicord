import { Command, Context, GuildMemberPlus, Currency } from 'lava/index';
const { MAX_LEVEL, XP_COST } = Currency;

export default class extends Command {
	constructor() {
		super('profile', {
			aliases: ['profile', 'level'],
			clientPermissions: ['EMBED_LINKS'],
			description: 'View your currency profile!',
			args: [
				{
					id: 'member',
					type: 'member',
					default: (c: Context) => c.member
				}
			]
		});
	}

	xp(xp: number): { next: number, barable: number, bar: string; } {
		return {
			next: Math.min((Math.trunc(xp / XP_COST) + 1) * XP_COST, MAX_LEVEL * XP_COST),
			barable: Math.round((XP_COST - (this.xp(xp).next - xp)) / (XP_COST / 10)),
			bar: this.client.util.progressBar(this.xp(xp).barValue),
		};
	}

	level(xp: number, level: number): { next: number, barable: number, bar: string; } {
		return {
			next: Math.min(level + 1, MAX_LEVEL),
			barable: Math.round((XP_COST - ((this.level(xp, level).next * XP_COST) - xp)) / (XP_COST / 10)),
			bar: this.client.util.progressBar(this.level(xp, level).barable)
		};
	}

	async exec(ctx: Context, { member }: { member: GuildMemberPlus }) {
		const { progressBar } = ctx.client.util;

		const exp = await ctx.currency.fetch(member.user.id).then(p => p.props.xp);
		const level = Math.trunc(exp / XP_COST);
		const levels = this.level(exp, level);
		const xps = this.xp(exp);

		const levelBar = `[${progressBar(levels.bar)}](https://discord.gg/invite/memer)`;
		const xpBar = `[${progressBar(xps.bar)}](https://discord.gg/invite/memer)`;

		return ctx.channel.send({ embed: {
			author: { 
				name: `${member.user.username}'s profile`, 
				iconURL: member.user.avatarURL({ dynamic: true }) 
			}, 
			color: 'BLURPLE', fields: [
				{
					name: 'Level',
					inline: true,
					value: `**\`${level.toLocaleString()}\`\n${levelBar}**`,
				},
				{
					name: 'Experience',
					inline: true,
					value: `**\`${exp.toLocaleString()}/${xps.next.toLocaleString()}\`\n${xpBar}**`
				}
			]
		}}).then(() => false);
	}
}