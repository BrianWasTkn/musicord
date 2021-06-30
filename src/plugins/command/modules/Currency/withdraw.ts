import { Command, Context, CurrencyEntry } from 'lava/index';
import { Argument, ArgumentTypeCaster } from 'discord-akairo';

export default class extends Command {
	constructor() {
		super('withdraw', {
			aliases: ['withdraw', 'with', 'take'],
			description: 'Withdraw your coins from your bank!',
			name: 'Withdraw',
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
		if (typeof arg === 'number') return arg as number;
		if (['all', 'max'].some(a => arg === a)) return entry.props.vault.amount;
	}

	async exec(ctx: Context, { amount }: { amount: number | string }) {
		const entry = await ctx.currency.fetch(ctx.author.id);
		if (amount === 'invalid') {
			return ctx.reply('U need to withdraw something lol');
		}

		const { pocket, vault, space } = entry.props;
		const withd = this.parseArgs(amount, entry);
		if (vault.locked) {
			return ctx.reply("You're being heisted so you can't withdraw lol");
		}
		if (vault.amount < 1) {
			return ctx.reply('You have nothing to withdraw?');
		}
		if (withd < 1) {
			return ctx.reply('Needs to be a whole number greater than 0');
		}
		if (withd > vault.amount) {
			return ctx.reply(`U only have **${vault.amount.toLocaleString()}** coins in your vault tf u on?`);
		}

		const { props } = await entry.withdraw(withd, true).save();
		return ctx.reply(`**${withd.toLocaleString()}** coins withdrawn. You now have **${props.vault.amount.toLocaleString()}** coins in your vault.`);
	}
}