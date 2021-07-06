import { Command, Context, GuildMemberPlus, Currency } from 'lava/index';
const { MAX_LEVEL, XP_COST } = Currency;

interface ProfileArgs {
	member: GuildMemberPlus;
	gamble: boolean;
}

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
				},
				{
					id: 'gamble',
					match: 'flag',
					flag: ['--gamble'],
					default: false
				}
			]
		});
	}

	xp(xp: number): { next: number, barable: number, bar: string; } {
		const next = Math.min((Math.trunc(xp / XP_COST) + 1) * XP_COST, MAX_LEVEL * XP_COST);
		const barable = Math.round((XP_COST - (next - xp)) / (XP_COST / 10));
		return { next, barable, bar: this.client.util.progressBar(barable) };
	}

	level(xp: number, level: number): { next: number, barable: number, bar: string; } {
		const next = Math.min(level + 1, MAX_LEVEL);
		const barable = Math.round((XP_COST - ((next * XP_COST) - xp)) / (XP_COST / 10));
		return { next, barable, bar: this.client.util.progressBar(barable) };
	}

	async exec(ctx: Context, { member, gamble }: ProfileArgs) {
		const { progressBar } = ctx.client.util;

		const entry = await ctx.currency.fetch(member.user.id);

		if (gamble) {
			const loses = entry.props.gambles.reduce((a, c) => a + c.loses, 0);
			const wins = entry.props.gambles.reduce((a, c) => a + c.wins, 0);
			const won = entry.props.gambles.reduce((a, c) => a + c.won, 0);
			const lost = entry.props.gambles.reduce((a, c) => a + c.lost, 0);

			return ctx.channel.send({ embed: {
				author: { name: `${member.user.username}'s gambling stats` },
				color: 'GREEN', fields: [...entry.props.gambles.map(g => ({
					inline: true, name: `${g.id.toUpperCase()} (${(g.wins + g.loses).toLocaleString()})`,
					value: [
						`**Won:** ${g.won.toLocaleString()}`,
						`**Lost:** ${g.lost.toLocaleString()}`,
						`**Net:** ${(g.won - g.lost).toLocaleString()}`,
						`**Win:** ${Math.round(100 * (g.wins / (g.wins + g.loses))).toLocaleString()}`,
					].join('\n')
				})), {
					inline: true, name: `TOTAL (${(loses + wins).toLocaleString()})`,
					value: [
						`**Won:** ${won.toLocaleString()}`,
						`**Lost:** ${lost.toLocaleString()}`,
						`**Net:** ${(won - lost).toLocaleString()}`,
						`**Win:** ${Math.round(100 * (wins / (wins + loses))).toLocaleString()}`,
					].join('\n')
				}]
			}}).then(() => false);
		}

		const exp = entry.props.xp;
		const level = Math.trunc(exp / XP_COST);
		const levels = this.level(exp, level);
		const xps = this.xp(exp);

		const levelBar = `[${levels.bar}](https://discord.gg/invite/memer)`;
		const xpBar = `[${xps.bar}](https://discord.gg/invite/memer)`;

		return ctx.channel.send({ embed: {
			author: { 
				name: `${member.user.username}'s profile`, 
				iconURL: member.user.avatarURL({ dynamic: true }) 
			}, 
			color: 'BLURPLE', fields: [
				{
					name: 'Level',
					inline: true,
					value: `**\`${level.toLocaleString()}\`**\n${levelBar}`,
				},
				{
					name: 'Experience',
					inline: true,
					value: `**\`${exp.toLocaleString()}/${xps.next.toLocaleString()}\`**\n${xpBar}`
				},
				{
					name: 'Coins',
					inline: true,
					value: [
						`**Wallet:** ${entry.props.pocket.toLocaleString()}`,
						`**Bank:** ${entry.props.vault.amount.toLocaleString()}`,
						`**Multi:** ${entry.calcMulti(ctx).unlocked.reduce((p, c) => p + c.value, 0)}%`
					].join('\n')
				}
			]
		}}).then(() => false);
	}
}