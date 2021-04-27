import { Context } from 'lib/extensions/message';
import { MessageOptions } from 'discord.js';
import { Item } from 'lib/handlers/item';

export default class Tool extends Item {
  constructor() {
    super('crown', {
		category: 'Tool',
		sellable: false,
		buyable: true,
		premium: true,
		usable: false,
		emoji: ':crown:',
		name: "Royal Crown",
		cost: 3,
		tier: 3,
		checks: ['time'],
		info: {
			short: 'Wear this to enchant your robbing skills!',
			long: 'Has a 100% chance of breaking someone\'s padlock!',
		},
    });
  }

  async use(ctx: Context): Promise<MessageOptions> {
  	const { parseTime } = ctx.client.util;
  	const entry = await ctx.db.fetch();
  	const data = entry.data;
  	const inv = super.findInv(data.items, this);

    return { replyTo: ctx.id, content: `r/woosh` };
  }
}
