import { Context, ContextDatabase } from 'lib/extensions/message';
import { GAMBLE_MESSAGES as Const } from 'lib/utility/constants';
import { ArgumentTypeCaster } from 'discord-akairo';
import { currencyConfig } from 'config/currency';

export default { type: 'gambleAmount', fn: (async (ctx: Context, args: string): Promise<number> => {
	const { pocket } = (await (ctx.db = new ContextDatabase(ctx)).fetch()).data;
	const { minBet, maxBet, maxPocket, maxSafePocket } = currencyConfig;
	const reply = (content: string) => ctx.reply({ content });

	// No Gamble Amount
	if (!args) {
		reply(Const.NEED_SOMETHING);
		return null;
	}

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
			reply(Const.BET_IS_NAN);
			return null;
		}
	}

	// @TODO: Move limit checks to individual gamble commands.
	return Number(args) || bet;
}) as ArgumentTypeCaster };