import { ArgumentType } from 'lib/objects';
import { Context } from 'lib/extensions';
import { Quest } from 'lib/handlers/quest';

export default new ArgumentType({
	id: 'questQuery', fn(ctx: Context, args: string): string | Quest {
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
});