import { ArgumentTypeCaster } from 'discord-akairo';
import { Context } from 'lib/extensions/message';
import { Item } from 'lib/handlers/item';

export default { type: 'shopItem', fn: ((ctx: Context, args: string): Item => {
	if (!args || args.length <= 2) return null; // dm update regarding arg searches
	const { modules } = ctx.client.handlers.item;
	const mod = modules.get(args.toLowerCase());

	let found: Item;
	found = modules.find(mod => {
		return mod.name.toLowerCase().includes(args.toLowerCase())
		|| mod.id.toLowerCase().includes(args.toLowerCase());
	});

	return mod || found || null;
}) as ArgumentTypeCaster };