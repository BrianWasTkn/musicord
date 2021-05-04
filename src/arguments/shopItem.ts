import { ArgumentType, Item } from 'lib/objects';
import { Context } from 'lib/extensions';

export default new ArgumentType({
	id: 'shopItem', fn(ctx: Context, args: string): Item {
		if (!args || args.length <= 2) return null;
		const { modules } = ctx.client.handlers.item;
		const { lowercase } = ctx.client.util;
		const mod = modules.get(lowercase(args));

		let found: Item;
		found = modules.find(mod => {
			return lowercase(mod.name).includes(lowercase(args))
			|| lowercase(mod.id).includes(lowercase(args));
		});

		return mod || found || null;
	}
});