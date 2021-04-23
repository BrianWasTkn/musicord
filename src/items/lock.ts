import { Context } from 'lib/extensions/message';
import { MessageOptions } from 'discord.js';
import { Item } from 'lib/handlers/item';

export default class Tool extends Item {
  constructor() {
    super('lock', {
      category: 'Tool',
      sellable: true,
      buyable: true,
      usable: true,
      emoji: ':lock:',
      name: "Lock",
      cost: 20000,
      checks: ['time'],
      info: {
        short: 'Increase protection from robbers!',
        long: 'Gives you protection against pesky robbers and heisters for 12 hours!',
      },
    });
  }

  async use(ctx: Context): Promise<MessageOptions> {
  	const { parseTime } = ctx.client.util;
  	const { data } = await ctx.db.fetch();
  	const inv = super.findInv(data.items, this);

  	const time = 12 * 60 * 60 * 1e3;
    inv.expire = Date.now() + time; // 12 hours
    inv.amount--;
    await data.save();

    return { content: `Your **${this.emoji} ${this.name}** has been activated for **${parseTime(time / 1e3)}** so be careful!` };
  }
}
