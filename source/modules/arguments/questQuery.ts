import { Arg, Quest } from 'lib/objects';
import { Currency } from 'lib/utility';
import { Context } from 'lib/extensions';

export default class Argument extends Arg {
	public constructor() {
		super('questQuery', {
			name: 'Quest Query',
			category: 'Currency',
		});
	}

	public exec(ctx: Context, args: string): string | Quest {
		if (!args || args.length <= 2) return null;
		if (['stop', 'check'].some(c => {
			return args.toLowerCase() === c;
		})) { return args.toLowerCase(); }

		const { modules } = ctx.client.handlers.quest;
		const { lowercase } = ctx.client.util;
		const mod = modules.get(lowercase(args));

		let found: Quest;
		found = modules.find(mod => {
			return lowercase(mod.name).includes(lowercase(args))
			|| lowercase(mod.id).includes(lowercase(args));
		});

		return mod || found || null;
	}
}