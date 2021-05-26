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
			cooldown: 5000,
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
		const entry = await ctx.currency.fetch(ctx.author.id);
		const bet = this.getArgs(ctx, entry);
		const multi = 100;

		if (!bet) {
			return { 
				content: 'You need something to bet!',
				reply: { messageReference: ctx.id },
			};
		}

		const { userD, botD } = this.roll();
		if (botD > userD || userD === botD) {
			if (botD > userD) {
				await entry.addCooldown(this.id, this.cooldown)
					.pocket(bet as number).remove()
					.calc().xp(true).calc().space()
					.save();
			}

			return { embed: {
				author: { name: `${ctx.author.username}'s gambling game` },
				color: userD === botD ? 'YELLOW' : 'RED',
				description: `${
					userD === botD 
						? 'You lost nothing!' 
						: `You lost **${
							(bet as number).toLocaleString()
						}** coins.`
				}\n\nYou ${
					userD === botD ? 'still' : 'now'
				} have **${
					entry.props.pocket.toLocaleString()
				}** coins.`,
				footer: { text: 'sucks to suck' },
				fields: Object.entries({
					[ctx.author.username]: `\`${userD}\``,
					[ctx.client.user.username]: `\`${botD}\``
				}).map(([name, value]) => ({ 
					name, value, inline: true 
				})),
			}};
		}

		let winnings = Math.ceil(bet * (Math.random() + 0.3));
		winnings = Math.min(Currency.MAX_WIN, winnings + Math.ceil(winnings * (multi / 100)));
		await entry.addCooldown(this.id, this.cooldown).pocket(winnings).add().save();
		
		return { embed: {
			author: { name: `${ctx.author.username}'s gambling game` },
			color: 'GREEN', description: `You won **${
				winnings.toLocaleString()
			}** coins.\n**Multiplier** ${
				multi.toLocaleString()
			} | **Percent of bet won** ${
				Math.round(winnings / bet).toLocaleString()
			}%\n\nYou now have **${
				entry.props.pocket.toLocaleString()
			}** coins.`, fields: Object.entries({
				[ctx.author.username]: `\`${userD}\``,
				[ctx.client.user.username]: `\`${botD}\``
			}).map(([name, value]) => ({ name, value, inline: true }))
		}}
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