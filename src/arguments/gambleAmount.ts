import { currencyConfig } from 'config/currency';
import { ArgumentType } from 'lib/objects';
import { Context } from 'lib/extensions';

export default new ArgumentType({
	id: 'gambleAmount', async fn(ctx: Context, args: string): Promise<string | number> {
		const { minBet, maxBet, maxPocket, maxSafePocket } = currencyConfig;
		const { isNumber } = ctx.client.util;
		const { pocket } = (await ctx.db.fetch()).data;
		
		if (!args) return null;
		if (!isNumber(args)) {
			args = args.toLowerCase();
			if (args === 'all')
				return pocket;
			else if (args === 'max')
				return Math.min(maxBet, pocket);
			else if (args === 'half')
				return Math.round(pocket / 2);
			else if (args === 'min')
				return minBet;
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