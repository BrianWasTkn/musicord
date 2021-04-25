import { MessageOptions } from 'discord.js';
import { Context } from 'lib/extensions/message';
import { Command } from 'lib/handlers/command';
import config from 'config/index' ;
import { Item } from 'lib/handlers/item';

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
    const { db, util, handlers } = this.client,
    { modules: items } = handlers.item,
    userEntry = await ctx.db.fetch(),
    data = userEntry.data;

    if (data.pocket >= config.currency.maxPocket) {
      return "You're already rich stop begging already.";
    }

    const odds = Math.random();
    switch (true) {
      case odds >= 0.9:
        const item = items.filter((i) => i.cost < 30e6).random();
        const amount = util.randomNumber(1, 10);
        let itinv = item.findInv(data.items, item);
        itinv.amount += amount;
        await userEntry.addCd().save();
        return {
          embed: {
            description: `WOWSIES! You got **${amount} ${item.emoji} ${
              item.name
            }**${amount > 1 ? 's' : ''} you're so lucky`,
            author: { name: ctx.client.user.username },
            color: 'ORANGE',
          },
          replyTo: ctx,
        };
      case odds >= 0.5:
        const won = util.randomNumber(10, 5000);
        await userEntry.addCd().addPocket(won).calcSpace().updateItems().save();
        return {
          embed: {
            description: `GG! You got **${won.toLocaleString()}** coins from begging.`,
            author: { name: ctx.client.user.username },
            color: 'ORANGE',
          },
          replyTo: ctx,
        };
      default:
        await userEntry.addCd().save();
        return {
          embed: {
            description: 'LOL YOU SUCK :clown:',
            author: { name: ctx.client.user.username },
            color: 'ORANGE',
          },
          replyTo: ctx,
        };
    }
  }
}
