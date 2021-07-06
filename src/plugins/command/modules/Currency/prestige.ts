import { Command, Context, Currency } from 'lava/index';
const { PRESTIGE_POCKET_REQ, PRESTIGE_LEVEL_REQ, XP_COST, PRESTIGE_LEVEL_CAP } = Currency;

const emojis = [
	'<:prestigeI:733606604326436897>',
	'<:prestigeII:733606705287397407>',
	'<:prestigeIII:733606758727024702>',
	'<:prestigeIV:733606800665870356>',
	'<:prestigeV:733606838523920405>',
	'<:prestigeVI:733606963471974500>',
	'<:prestigeVII:733607038969577473>',
	'<:prestigeVIII:733608252562079784>',
	'<:prestigeIX:733607250584797214>',
	'<:prestigeX:733607342263894056>',
];

export default class extends Command {
	constructor() {
		super('prestige', {
			aliases: ['prestige'],
			cooldown: 1000 * 60 * 60,
			description: 'Upgrade your progress!',
			name: 'Prestige'
		});
	}

	async exec(ctx: Context) {
		const entry = await ctx.currency.fetch(ctx.author.id);

		const current = {
			pocket: Number((entry.props.pocket / Math.min(PRESTIGE_LEVEL_CAP * PRESTIGE_POCKET_REQ, PRESTIGE_POCKET_REQ * entry.prestige.level)).toFixed(1)),
			level: Number(((entry.props.xp / XP_COST) / Math.min(PRESTIGE_LEVEL_CAP * PRESTIGE_LEVEL_REQ, PRESTIGE_LEVEL_REQ * entry.prestige.level)).toFixed(1))
		};
		const next = {
			prestige: entry.prestige.level + 1,
			pocket: (entry.prestige.level + 1) * PRESTIGE_POCKET_REQ,
			level: (entry.prestige.level + 1) * PRESTIGE_LEVEL_REQ,
		};

		if (!Object.values(current).every(c => c >= 100)) {
			return ctx.reply({ embed: {
				author: { name: `Prestige ${ctx.client.util.toRoman(next.prestige)} Requirements` },
				color: 'RANDOM', description: [
					`**Pocket Amount:** \`${entry.props.pocket.toLocaleString()}/${next.pocket.toLocaleString()}\` \`(${current.pocket}%)\``,
					`**Levels Required:** \`${Math.trunc(entry.props.xp / XP_COST).toLocaleString()}/${next.level.toLocaleString()}\` \`(${current.level}%)\``,
				].join('\n')
			}}).then(() => false);
		}

		return ctx.reply(`You're ready!`).then(() => false);
	}
}