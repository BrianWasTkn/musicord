import { MessageOptions } from 'discord.js';
import { Context } from 'lib/extensions/message';
import { Item } from 'lib/handlers/item';

export default class PowerUp extends Item {
  constructor() {
    super('dragon', {
      category: 'Power-Up',
      sellable: false,
      buyable: true,
      usable: true,
      emoji: ':dragon:',
      name: "Lava's Dragon",
      cost: 65000,
      checks: ['activeState'],
      info: {
        short: 'Grants you a great luck in rolling a dice whilst gambling!',
        long:
          "Gives you +1 to your gambling dice although you'll lose it if your dragon goes away from you.",
      },
    });
  }

  async use(ctx: Context): Promise<MessageOptions> {
    const { parseTime } = ctx.client.util;
    const time = 12 * 60 * 60 * 1000;
    const expire = Date.now() + time;
    const active = true;

    await ctx.db.updateInv(this.id, { expire, active }).updateItems().save();
    return { content: `${this.emoji} Your dragon has been activated for **${parseTime(time / 1e3)}**, be careful when gambling!` };
  }
}
