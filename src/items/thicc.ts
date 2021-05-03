import { MessageOptions } from 'discord.js';
import { Context } from 'lib/extensions';
import { Item } from 'lib/objects';

export default class PowerUp extends Item {
  constructor() {
    super('thicc', {
      category: 'Power-Up',
      sellable: true,
      buyable: true,
      usable: true,
      emoji: ':joy:',
      name: "Thicco's Thiccness",
      cost: 45000,
      tier: 1,
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
    return { replyTo: ctx.id, content: `**${this.emoji} You activated ${this.name.toLowerCase()}!**\nYou now have an additional **50%** winnings in gambling for a lucky ${parseTime(time / 1e3)}!` };
  }
}
