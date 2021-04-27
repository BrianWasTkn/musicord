import { Context } from 'lib/extensions/message';
import { MessageOptions } from 'discord.js';
import { Item } from 'lib/handlers/item';

export default class PowerUp extends Item {
  constructor() {
    super('coffee', {
      category: 'Power-Up',
      sellable: true,
      buyable: true,
      usable: true,
      emoji: ':hot_face:',
      name: "Badddie's Coffee",
      cost: 30000,
      tier: 2,
      checks: ['time'],
      info: {
        short: 'Boosts your multiplier at a massive rate.',
        long: 'Gives up to 50% multiplier for 10 minutes.',
      },
    });
  }

  async use(ctx: Context): Promise<MessageOptions> {
    const { randomNumber, sleep, parseTime } = this.client.util;
    const { data } = ctx.db, multi = randomNumber(5, 50);
    const time = 10 * 60 * 1e3, expire = Date.now() + time;

    await ctx.db.updateInv(this.id, { multi, expire }).removeInv(this.id).updateItems().save();
    return { replyTo: ctx.id, content: `${this.emoji} Your coffee granted you a **${multi}% multiplier** valid for ${parseTime(time / 1e3)}!` };
  }
}
