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
			switch (args.toLowerCase()) {
				case 'all':
					return pocket;
				case 'max':
					return Math.min(MAX_BET, pocket);
				case 'half':
					return MIN_BET;
				default:
					if (args.match(/k/g)) {
						const kay = args.replace(/k$/g, '');
						return isNumber(kay) ? Number(kay) * 1e3 : null;
					}

					return null;
			}
		}

		return Number(args) || null;
	}
});