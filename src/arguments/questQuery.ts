import { ArgumentTypeCaster } from 'discord-akairo';
import { Context } from 'lib/extensions/message';
import { Quest } from 'lib/handlers/quest';

export default { type: 'questQuery', fn: ((ctx: Context, args: string): string | Quest => {
	if (!args || args.length <= 2) return null; // dm update regarding arg searches
	if (['stop', 'check', 'list'].some(c => {
		return args.toLowerCase() === c;
	})) { return args; }

	const { modules } = ctx.client.handlers.quest;
	const mod = modules.get(args.toLowerCase());

	let found: Quest;
	found = modules.find(mod => {
		return mod.name.toLowerCase().includes(args.toLowerCase())
		|| mod.id.toLowerCase().includes(args.toLowerCase());
	});

	return mod || found || null;
}) as ArgumentTypeCaster };