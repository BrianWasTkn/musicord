import { Command, Context, CurrencyEntry } from 'lava/index';
import { Argument, ArgumentTypeCaster } from 'discord-akairo';

export default class extends Command {
	constructor() {
		super('deposit', {
			aliases: ['deposit', 'dep', 'put'],
			description: 'Deposit your coins into your bank!',
			name: 'Deposit',
			args: [
				{
					id: 'amount',
					type: Argument.union('number', ((c: Context, p: string) => {
						return ['all', 'max'].some(dep => dep === p.toLowerCase()) ? p.toLowerCase() : 'invalid';
					}) as ArgumentTypeCaster)
				}
			]
		});
	}

	parseArgs(arg: number | string, entry: CurrencyEntry) {
		if (typeof arg === 'number') return { dep: arg as number, all: false };
		if (['all', 'max'].some(a => arg === a)) return { dep: entry.props.pocket, all: true };
	}

	async exec(ctx: Context, { amount }: { amount: number | string }) {
		const entry = await ctx.currency.fetch(ctx.author.id);
		if (amount === 'invalid') {
			return ctx.reply('U need to deposit something lol');
		}

		const { pocket, vault, space } = entry.props;
		const { dep, all } = this.parseArgs(amount, entry);
		if (pocket < 1) {
			return ctx.reply('U have nothing to deposit lol');
		}
		if (dep < 1) {
			return ctx.reply('Needs to be a whole number greater than 0');
		}
		if (dep > pocket) {
			return ctx.reply(`U only have **${pocket.toLocaleString()}** coins lol don't lie to me hoe`);
		}
		if (vault.amount >= space) {
			return ctx.reply('U already have full bank!');
		}
		if ((dep > space - vault.amount) && !all) {
			return ctx.reply(`You can only hold **${space.toLocaleString()}** coins right now. To hold more, use the bot more.`);
		}

		const deposit = dep >= space - vault.amount ? space - vault.amount : dep;
		const { props } = await entry.deposit(deposit, true).save();
		return ctx.reply(`**${deposit.toLocaleString()}** coins deposited. You now have **${props.vault.amount.toLocaleString()}** coins in your vault.`);
	}
}