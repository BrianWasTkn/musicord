import { ArgumentType } from './ArgumentType';
import { Context } from 'lib/extensions/message';
import { Quest } from 'lib/handlers/quest';

export default new ArgumentType('questQuery', 
	(ctx, args): string | Quest => {
		if (!args || args.length <= 2) return null;
		if (['stop', 'check'].some(c => {
			return args.toLowerCase() === c;
		})) { return args.toLowerCase(); }

		const { modules } = ctx.client.handlers.quest;
		const mod = modules.get(args.toLowerCase());

		let found: Quest;
		found = modules.find(mod => {
			return mod.name.toLowerCase().includes(args.toLowerCase())
			|| mod.id.toLowerCase().includes(args.toLowerCase());
		});

		return mod || found || null;
	}
);