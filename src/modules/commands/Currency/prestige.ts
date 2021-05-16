import { Context, ContextDatabase } from 'lib/extensions';
import { Currency as Caps } from 'lib/utility/constants';
import { MessageOptions } from 'discord.js';
import { Command } from 'lib/objects';

export default class Currency extends Command {
	constructor() {
		super('prestige', {
			name: 'Prestige',
			aliases: ['prestige'],
			channel: 'guild',
			description: "Upgrade and upgrade! You're unstoppable!",
			category: 'Currency',
			ownerOnly: true
		});
	}

	async exec(ctx: Context, entry: ContextDatabase): Promise<MessageOptions> {
		const { stats: { xp, prestige }, pocket } = entry.data;
		const { LEVEL, POCKET } = Caps.PRESTIGE;
		const { toRoman } = ctx.client.util;

		const data = {
			pocket: Number((pocket / POCKET * 100).toFixed(1)),
			level: Number(((xp / 100) / LEVEL * 100).toFixed(1))
		};
		const next = {
			prestige: prestige + 1,
			pocket: (prestige + 1) * POCKET,
			level: (prestige + 1) * LEVEL,
		}

		if (!Object.values(data).every(d => d >= 100)) {
			return { reply: { messageReference: ctx.id }, embed: {
				author: { name: `Prestige ${toRoman(next.prestige)} Requirements` },
				color: 'RANDOM', description: `**Pocket Amount:** \`${
					pocket.toLocaleString()
				}/${next.pocket.toLocaleString()}\` \`(${
					data.pocket
				}%)\`\n**Levels Required:** \`${
					Number((xp / 100).toFixed(1)).toLocaleString()
				}/${next.level.toLocaleString()}\` \`(${
					data.level
				}%)\``
			}};
		}
	}
}
