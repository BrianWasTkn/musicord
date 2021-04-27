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
      name: "Padlock",
      cost: 20000,
      tier: 2,
      checks: ['time'],
      info: {
        short: 'Increase protection from robbers!',
        long: 'Gives you protection against pesky robbers and heisters for 12 hours!',
      },
    });
  }

  async use(ctx: Context): Promise<MessageOptions> {
  	const { parseTime } = ctx.client.util;
  	const time = 12 * 60 * 60 * 1e3;
    const expire = Date.now() + time;

    await ctx.db.updateInv(this.id, { expire }).removeInv(this.id).updateItems().save();
    return { content: `Your **${this.emoji} ${this.name}** has been activated for **${parseTime(time / 1e3)}** so be careful!` };
  }
}
