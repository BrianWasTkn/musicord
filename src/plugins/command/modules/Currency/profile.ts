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
		return Math.min(this.getLevel(xp) + 1), MAX_LEVEL);
	}

	getBarValues(xp: number, level: number) {
		return (nextLevel: number) => ({
			xp: (XP_COST - (nextLevel - xp)) / (XP_COST / 10),
			level: (XP_COST - ((nextLevel * XP_COST) - xp)) / (XP_COST / 10)
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

		return ctx.channel.send({ embed: {
			author: { name: `${member.user.username}'s profile` }, fields: [
				{
					name: 'Level',
					value: `\`${this.getLevel(exp).toLocaleString()}\`\n${bars.level}`,
				},
				{
					name: 'Experience',
					value: `\`${exp.toLocaleString()}/${this.getNext(exp).xp.toLocaleString()}\`\n${bars.xp}`
				}
			]
		}}).then(() => false);
	}
}