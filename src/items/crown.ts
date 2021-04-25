import { Context } from 'lib/extensions/message';
import { MessageOptions } from 'discord.js';
import { Item } from 'lib/handlers/item';

export default class Tool extends Item {
  constructor() {
    super('crown', {
		category: 'Tool',
		sellable: false,
		buyable: false,
		premium: true,
		usable: false,
		emoji: ':crown:',
		name: "Royal Crown",
		shop: false,
		cost: 10,
		checks: ['time'],
		info: {
			short: '[WIP] Secret Item :)',
			long: 'OwO what\'s this?',
		},
    });
  }

  async use(ctx: Context): Promise<MessageOptions> {
  	const { parseTime } = ctx.client.util;
  	const entry = await ctx.db.fetch();
  	const data = entry.data;
  	const inv = super.findInv(data.items, this);

    return { content: `r/woosh` };
  }
}
