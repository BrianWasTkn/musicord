import { ArgumentType } from 'lib/objects';
import { Currency } from 'lib/utility';
import { Context } from 'lib/extensions';

export default new ArgumentType({
	id: 'gambleAmount', async fn(ctx: Context, args: string): Promise<string | number> {
		const { data: { pocket } } = await ctx.db.fetch();
		const { MIN_BET, MAX_BET } = Currency;
		const { isNumber } = ctx.client.util;

		if (!args) return null;
		if (!isNumber(args)) {
			args = args.toLowerCase();
			if (args === 'all')
				return pocket;
			else if (args === 'max')
				return Math.min(MAX_BET, pocket);
			else if (args === 'half')
				return Math.round(pocket / 2);
			else if (args === 'min')
				return MIN_BET;
			else if (args.match(/k/g)) {
				const kay = args.replace(/k$/g, '');
				return isNumber(kay) ? Number(kay) * 1e3 : null;
			}	else {
				return null;
			}
		}

		return Number(args) || null;
	}
});