import { Context, ContextDatabase } from 'lib/extensions/message';
import { currencyConfig } from 'config/currency';
import { ArgumentType } from './ArgumentType';

export default new ArgumentType('gambleAmount', 
	async (ctx: Context, args: string): Promise<string | number> => {
		const { pocket } = (await (ctx.db = new ContextDatabase(ctx)).fetch()).data;
		const { minBet, maxBet, maxPocket, maxSafePocket } = currencyConfig;

		// No Gamble Amount
		if (!args) return null;
		let bet: number;
		// Non-integer
		if (!Number.isInteger(args)) {
			// Other non numbers
			args = args.toLowerCase();
			if (args === 'all')
				bet = pocket;
			else if (args === 'max')
				bet = Math.min(maxBet, pocket);
			else if (args === 'half')
				bet = Math.round(pocket / 2);
			else if (args === 'min')
				bet = minBet;
			else if (args.match(/k/g)) {
				const kay = args.replace(/k$/g, '');
				bet = Number(kay) ? Number(kay) * 1e3 : null;
			}	else {
				bet = null;
			}
		}

		return Number(args) || Number(bet) || args || null;
	}
);