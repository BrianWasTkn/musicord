import { Context, ContextDatabase, MemberPlus } from 'lib/extensions';
import { Currency as Caps } from 'lib/utility/constants';
import { MessageOptions } from 'discord.js';
import { Command } from 'lib/objects';

export default class Currency extends Command {
	constructor() {
		super('profile', {
			name: 'Profile',
			aliases: ['profile', 'level'],
			channel: 'guild',
			description: "View basic info about your currency progress.",
			category: 'Currency',
			cooldown: 1e3,
			args: [
				{
					id: 'member',
					type: 'member',
					default: (m: Context) => m.member,
				},
			],
		});
	}

	public async exec(
		ctx: Context<{ member: MemberPlus }>,
		userEntry: ContextDatabase
	): Promise<MessageOptions> {
		const isContext = ctx.author.id === ctx.args.member.user.id;
		const entry = isContext ? userEntry : await ctx.db.fetch(ctx.args.member.user.id, false);
		const { data } = entry, { pocket, vault, stats, items } = data;
		const { parseTime, toRoman, progressBar } = ctx.client.util;

		// calc the percents
		function calc(number: number, base: number) {
			switch(true) {
				case number >= base * 0.99:
					return 10;
				case number >= base * 0.9:
					return 9;
				case number >= base * 0.8:
					return 8;
				case number >= base * 0.7:
					return 7;
				case number >= base * 0.6:
					return 6;
				case number >= base * 0.5:
					return 5;
				case number >= base * 0.4:
					return 4;
				case number >= base * 0.3:
					return 3;
				case number >= base * 0.2:
					return 2;
				case number >= base * 0.1:
					return 1;
				default:
					return 0;
			}
		}

		// Level
		let level: string | number = (stats.xp / 1e3) > 0 ? Math.round(stats.xp / 1e3) : 0;
		level = Math.min(Caps.MAX_LEVEL, level);
		level = `**${level}**\n[${progressBar(calc(level, 1000))}](https://google.com)`;
		// XP
		let xp = `**${stats.xp} / ${(Math.trunc(stats.xp / 100) * 100) + 1}**\n[${progressBar(calc(stats.xp, 10000))}](https://google.com)`;
		// Coins
		let coins = [
			`**${pocket.toLocaleString()}** in pocket`,
			`**${vault.toLocaleString()}** in vault`,
			`**${(pocket + vault).toLocaleString()}** in total`,
		];
		// Multis
		let multis = `**${ctx.client.db.currency.utils.calcMulti(ctx, data).total}** out of **${Caps.MAX_MULTI}** found`;
		// Win rate
		let winRate = `**${(100 * (stats.wins / (stats.wins + stats.loses))).toFixed(1)}%** win rate`;
		// Games Played
		let gamesPlayed = [
			`**${(stats.wins + stats.loses).toLocaleString()}** games`,
			`**${stats.wins.toLocaleString()}** times won`,
			`**${stats.loses.toLocaleString()}** times lost`,
		];
		// Gambling Stats
		let gambleStats = [
			`**${(stats.won - stats.lost).toLocaleString()}** net`,
			`**${stats.won.toLocaleString()}** coins won`,
			`**${stats.lost.toLocaleString()}** coins lost`,
			`**${(stats.won / (stats.won + stats.lost)).toLocaleString()}%** rate`
		];
		// Active Items
		let activeItems = items.filter((i) => i.expire > ctx.createdTimestamp)
		.map((i) => {
			const it = ctx.client.handlers.item.modules.get(i.id);
			const expire = parseTime(Math.floor((i.expire - ctx.createdTimestamp) / 1e3));
			return `**${it.emoji} ${it.name}** — expires in ${expire}`;
		});

		// @TODO: Prestige system
		// let desc: string[] = [];
		// if (stats.prestige > 0) desc.push(`**Prestige ${toRoman(stats.prestige)}`);

		return {
			embed: {
				author: {
					name: `${ctx.args.member.user.username}'s profile`,
					icon_url: ctx.args.member.user.avatarURL({ dynamic: true })
				},
				color: 'BLURPLE', fields: Object.entries({
					'Level': level,
					'Experience': xp,
					'Coins': coins.join('\n'),
					'Multiplier': multis,
					'Win Rate': winRate,
					'Games Played': gamesPlayed.join('\n'),
					'Gamble Stats': gambleStats.join('\n'),
					'Active Items': activeItems.join('\n') || 'No active items.'
				}).map(([name, value]) => ({ name, value, inline: true }))
			}
		};
	}
}
