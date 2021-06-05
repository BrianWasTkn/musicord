import { Command, Context, CurrencyEntry, Currency, UserPlus } from 'lava/index';
import { MessageOptions, EmbedFieldData } from 'discord.js';
import { Argument } from 'discord-akairo';

export default class extends Command {
	constructor() {
		super('gamble', {
			aliases: ['gamble', 'bet', 'roll'],
			channel: 'guild',
			clientPermissions: ['EMBED_LINKS'],
			cooldown: 5000,
			name: 'Gamble',
			args: [
				{
					id: 'amount',
					type: Argument.union('number', 'string')
				}
			]
		});
	}

	parseArgs(ctx: Context<{ amount: number | string }>, entry: CurrencyEntry): number {
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

		return parseFloat(amount as string) || null;
	}

	displayField(user: UserPlus, userD: number, botD: number): EmbedFieldData[] {
		return [
			{ name: user.username, value: `\`${userD}\`` },
			{ name: this.client.user.username, value: `\`${botD}\`` }
		];
	}

	async exec(ctx: Context<{ amount: number | string }>): Promise<MessageOptions> {
		const entry = await ctx.currency.fetch(ctx.author.id);
		const bet = this.parseArgs(ctx, entry);
		const multi = 100;

		if (!bet) {
			return { 
				reply: { messageReference: ctx.id }, 
				content: 'You need to bet something!' 
			};
		}

		const { userD, botD } = this.roll();
		if (botD > userD || botD === userD) {
			const { props } = await (botD === userD 
				? entry.calc().xp(true)
				: entry.removeProps('pocket', bet)
			).save();
			

			return { embed: {
				author: { name: `${ctx.author.username}'s gambling game` },
				color: userD === botD ? 'YELLOW' : 'RED', 
				description: [
					`You lost ${botD === userD ? 'nothing!' : `**${bet.toLocaleString()}** coins.`}\n`,
					`You ${botD === userD ? 'still' : 'now'} have **${props.pocket.toLocaleString()}** coins.`
				].join('\n'), fields: this.displayField(ctx.author, userD, botD)
			}};
		}

		let winnings = Math.ceil(bet * (Math.random() + 0.3));
		winnings = Math.min(Currency.MAX_WIN, winnings + Math.ceil(winnings * (multi / 100)));
		const { props } = await entry.addProps('pocket', winnings).save();

		return { embed: {
			author: { name: `${ctx.author.username}'s gambling game` },
			color: 'GREEN', description: [
				`You won **${winnings.toLocaleString()}** coins.`,
				`**Multiplier** ${multi.toLocaleString()}% | **Percent of bet won** ${Math.round(winning / bet).toLocaleString()}%\n`,
				`You now have **${props.pocket.toLocaleString()}** coins.`
			].join('\n')
		}}
	}

	roll() {
		const { randomNumber } = this.client.util;
		let userD = randomNumber(1, 12);
		let botD = randomNumber(1, 12);

		/**
		 * Rig the dice because why not >:)
		 */
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