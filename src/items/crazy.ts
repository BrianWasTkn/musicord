import { Context } from 'lib/extensions/message';
import { MessageOptions } from 'discord.js';
import { Item } from 'lib/handlers/item';

export default class PowerUp extends Item {
  constructor() {
    super('crazy', {
      category: 'Power-Up',
      sellable: true,
      buyable: true,
      usable: true,
      emoji: ':beers:',
      name: "Crazy's Alcohol",
      cost: 500000,
      tier: 2,
      checks: ['time'],
      info: {
        short:
          'Grants you a great amount of luck while playing the slot machine!',
        long:
          "Gives you a 10% chance of getting jackpot on slots! Only lasts for 10 minutes since you're jsut a normie.",
      },
    });
  }

  async use(ctx: Context): Promise<MessageOptions> {
    const time = 10 * 60 * 1000, expire = Date.now() + time;
    await ctx.db.updateInv(this.id, { expire }).removeInv(this.id).updateItems().save();
    return { content: 'You now have a **10%** jackpot chance for 10 minutes!' };
  }
}
