import { Context } from '@lib/extensions/message';
import { Item } from '@lib/handlers/item';

export default class PowerUp extends Item {
  constructor() {
    super('thicc', {
      category: 'Power-Up',
      sellable: true,
      buyable: true,
      usable: true,
      emoji: ':joy:',
      name: "Thicco's Thiccness",
      cost: 3000000,
      info: {
        short: 'Empower your gamble winnings with thicco\'s thiccnes.',
        long: 'Gives you +50% winnings on gambling for roughly 10 minutes.',
      }
    });
  }

  async use(ctx: Context): Promise<string> {
    const { data } = await ctx.db.fetch();
    const thicc = this.findInv(data.items, this);

    thicc.expire = Date.now() + 10 * 60 * 1000; // client.setTimeout just breaks this
    thicc.amount--;

    await ctx.db.updateItems().save();
    return 'You have been granted an additional **50%** winnings in gambling for a lucky 10 minutes!';
  }
}
