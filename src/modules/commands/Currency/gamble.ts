import { Command, Context, CurrencyEntry, Currency } from 'src/library';
import { MessageOptions } from 'discord.js';
import { Argument } from 'discord-akairo';

export default class CurrencyCommand extends Command {
	public constructor() {
		super('gamble', {
			name: 'Gamble',
			channel: 'guild',
			aliases: ['gamble', 'bet', 'roll'],
			category: 'Currency',
			clientPermissions: ['EMBED_LINKS'],
			args: [{
				id: 'amount',
				type: Argument.union('number', 'string')
			}]
		});
	}

	private getArgs(ctx: Context<{ amount: string | number }>, entry: CurrencyEntry): number {
		const { MIN_BET, MAX_BET, MAX_POCKET } = Currency;
		const { isInteger } = ctx.client.util;
		const { pocket } = entry.props;
		const { amount } = ctx.args;

		if (!amount) return null;
		if (!isInteger(Number(amount))) {
			switch((amount as string).toLowerCase()) {
				case 'all':
					return pocket;
				case 'max':
					return Math.min(MAX_BET, pocket);
				case 'half':
					return Math.trunc(Math.min(MAX_BET, pocket) / 2);
				case 'min':
					return MIN_BET;
				default:
					if ((amount as string).match(/k/g)) {
						const kay = (amount as string).replace(/k$/g, '');
						return isInteger(kay) ? Number(kay) * 1e3 : null;
					}

					return null;
			}
		}

		return parseInt(amount as string, 10) || null;
	}

	public async exec(ctx: Context<{ amount: number | string }>): Promise<MessageOptions> {
		const entry = await ctx.db.currency.fetch(ctx.author.id);
		const args = this.getArgs(ctx, entry);
		const multi = 100;

		if (!args) {
			return { 
				content: 'You need something to bet!',
				reply: { messageReference: ctx.id },
			};
		}

		const { userD, botD } = this.roll();
		if (botD > userD || userD === botD) {
			if (botD > userD) await entry.pocket(args as number).remove().save();
			return { embed: {
				author: { name: `${ctx.author.username}'s gambling game` },
				color: userD === botD ? 'YELLOW' : 'RED',
				description: userD === botD ? 'You lost nothing!' : `You lost **${(args as number).toLocaleString()}** coins.`,
				footer: { text: 'sucks to suck' }
			}};
		}
	}

	private roll() {
		const { randomNumber } = this.client.util;
		let userD = randomNumber(1, 12);
		let botD = randomNumber(1, 12);

		function rig(a: number, b: number) {
			return a > b ? [b, a] : [a, b];
		}

		if (Math.random() > 0.6) {
			[botD, userD] = rig(botD, userD);
		} else {
			[userD, botD] = rig(botD, userD);
		}

		return { userD, botD };
	}
}