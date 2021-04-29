import { ArgumentType } from './ArgumentType';
import { Context } from 'lib/extensions/message';
import { Item } from 'lib/handlers/item';

export default new ArgumentType('shopItem', 
	(ctx, args): Item => {
		if (!args || args.length <= 2) return null;
		const { modules } = ctx.client.handlers.item;
		const mod = modules.get(args.toLowerCase());

		let found: Item;
		found = modules.find(mod => {
			return mod.name.toLowerCase().includes(args.toLowerCase())
			|| mod.id.toLowerCase().includes(args.toLowerCase());
		});

		return mod || found || null;
	}
);