import { Context } from 'lib/extensions/message';
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
        long: 'Gives you protection against pesky robbers and heisters for 3 hours!',
      },
    });
  }

  async use(ctx: Context) {
  	const { parseTime } = ctx.client.util;
  	const { data } = await ctx.db.fetch();
  	const inv = super.findInv(data.items, this);

  	const time = 3 * 60 * 60 * 1e3;
    inv.expire = Date.now() + time; // 3 hours
    await data.save();

    return `${this.emoji} Your pocket's now safe for ${parseTime(time / 1e3)} so be careful!`;
  }
}
