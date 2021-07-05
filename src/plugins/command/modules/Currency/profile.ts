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

	getNextXP(xp: number) {
		return Math.min((this.getLevel(xp) + 1) * XP_COST, MAX_LEVEL * XP_COST);
	}

	getNextLevel(xp: number) {
		return Math.min(this.getLevel(xp) + 1, MAX_LEVEL);
	}

	getBarValues(xp: number, level: number) {
		return (nextLevel: number) => ({
			level: (XP_COST - ((nextLevel * XP_COST) - xp)) / (XP_COST / 10),
			xp: (XP_COST - (nextLevel - xp)) / (XP_COST / 10),
		});
	}

	getNext(xp: number) {
		return {
			level: this.getNextLevel(this.getLevel(xp)),
			xp: this.getNextXP(xp)
		};
	}

	getLevel(xp: number) {
		return Math.trunc(xp / XP_COST);
	}

	async exec(ctx: Context, { member }: { member: GuildMemberPlus }) {
		const { progressBar } = ctx.client.util;

		const exp = await ctx.currency.fetch(ctx.author.id).then(p => p.props.xp);
		const bars = this.getBarValues(exp, this.getLevel(exp))(this.getNext(exp).level);
		const levelBar = `[${progressBar(bars.level)}](https://discord.gg/invite/memer)`;
		const xpBar = `[${progressBar(bars.xp)}](https://discord.gg/invite/memer)`;

		return ctx.channel.send({ embed: {
			author: { 
				name: `${member.user.username}'s profile`, 
				iconURL: member.user.avatarURL({ dynamic: true }) 
			}, 
			fields: [
				{
					name: 'Level',
					inline: true,
					value: `**\`${this.getLevel(exp).toLocaleString()}\`\n${levelBar}**`,
				},
				{
					name: 'Experience',
					inline: true,
					value: `**\`${exp.toLocaleString()}/${this.getNext(exp).xp.toLocaleString()}\`\n${xpBar}**`
				}
			]
		}}).then(() => false);
	}
}