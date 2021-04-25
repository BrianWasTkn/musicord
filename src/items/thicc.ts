import { MessageOptions } from 'discord.js';
import { Context } from 'lib/extensions/message';
import { Item } from 'lib/handlers/item';

export default class PowerUp extends Item {
  constructor() {
    super('thicc', {
      category: 'Power-Up',
      sellable: true,
      buyable: true,
      usable: true,
      emoji: ':joy:',
      name: "Thicco's Thiccness",
      cost: 60000,
      checks: ['time'],
      info: {
        short: "Empower your gamble winnings with thicco's thiccnes.",
        long: 'Gives you +50% winnings on gambling for roughly 10 minutes.',
      },
    });
  }

  async use(ctx: Context): Promise<MessageOptions> {
    const { parseTime } = ctx.client.util;
    const time = 10 * 60 * 1e3;
    const expire = Date.now() + time;

    await ctx.db.updateInv(this.id, { expire }).removeInv(this.id).updateItems().save();
    return { content: 'You have been granted an additional **50%** winnings in gambling for a lucky 10 minutes!' };
  }
}
