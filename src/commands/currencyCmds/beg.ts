import { MessageOptions } from 'discord.js';
import { Context } from '@lib/extensions/message';
import { Command } from '@lib/handlers/command';
import { Item } from '@lib/handlers/item';

export default class Currency extends Command {
  constructor() {
    super('beg', {
      aliases: ['beg', 'gimme'],
      channel: 'guild',
      description: 'Gives you a random amount of coins from 100k to 1m coins',
      category: 'Currency',
      cooldown: 3e4,
    });
  }

  async exec(ctx: Context): Promise<string | MessageOptions> {
    const { db, util, handlers, config } = this.client;
    const { data } = await ctx.db.fetch();
    const items = handlers.item.modules;

    if (data.pocket >= config.currency.maxPocket) {
      return "You're already rich stop begging already.";
    }

    const odds = Math.random();
    switch (true) {
      case odds >= 0.9:
        const item = items.filter((i) => i.cost < 30e6).random();
        const amount = util.randomNumber(1, 5);
        let itinv = data.items.find((i) => i.id === item.id);
        itinv.amount += amount;
        await data.save();
        return {
          embed: {
            description: `WOWSIES! You got **${amount} ${item.emoji} ${
              item.name
            }**${amount > 1 ? 's' : ''} you're so lucky`,
            color: 'ORANGE',
            author: { name: 'Lava' },
          },
          replyTo: ctx,
        };
      case odds >= 0.5:
        const won = util.randomNumber(100, 1000) * 1e3;
        await ctx.db.addPocket(won).calcSpace().updateItems().save();
        return {
          embed: {
            description: `GG! You got **${won.toLocaleString()}** coins from begging.`,
            color: 'ORANGE',
            author: { name: 'Lava' },
          },
          replyTo: ctx,
        };
      default:
        return {
          embed: {
            description: 'LOL NO THANKS :P',
            color: 'ORANGE',
            author: { name: 'Lava' },
          },
          replyTo: ctx,
        };
    }
  }
}
