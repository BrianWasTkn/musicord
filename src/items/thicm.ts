import { MessageOptions } from 'discord.js';
import { Context } from 'lib/extensions/message';
import { Item } from 'lib/handlers/item';

export default class PowerUp extends Item {
  constructor() {
    super('thicm', {
      category: 'Power-Up',
      sellable: true,
      buyable: true,
      usable: true,
      emoji: ':ok_hand:',
      name: 'Thicco Mode',
      cost: 55000,
      checks: ['time'],
      info: {
        short:
          'Blackjack rigged? Well if you want more coins, activate thicco mode.',
        long: 'Gives you +50% winnings on blackjack for 10 minutes.',
      },
    });
  }

  async use(ctx: Context): Promise<MessageOptions> {
    const entry = await ctx.db.fetch();
    const data = entry.data
    const thicc = this.findInv(data.items, this);

    thicc.expire = Date.now() + 10 * 60 * 1000;
    await entry.updateItems().removeInv(this.id).save();
    return { content: `**You activated thicco mode**\nYou've been granted a **50%** winnning power for blackjack for 10 minutes!` };
  }
}
