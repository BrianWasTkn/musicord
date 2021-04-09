import { MessageOptions } from 'discord.js';
import { MessagePlus } from '@lib/extensions/message';
import { Command } from '@lib/handlers/command';
import { Item } from '@lib/handlers/item';

export default class Currency extends Command {
  constructor() {
    super('gimme', {
      aliases: ['beg', 'gimme'],
      channel: 'guild',
      description: 'Gives you a random amount of coins from 100k to 1m coins',
      category: 'Currency',
      cooldown: 2e4,
    });
  }

  async exec(msg: MessagePlus): Promise<string | MessageOptions> {
    const { db, util, handlers } = this.client;
    const data = await msg.author.fetchDB();
    const items = handlers.item.modules;

    const odds = Math.random();

    if (odds >= 0.9) {
      const item = items.filter((i) => i.cost < 30e6).random();
      const amount = util.randomNumber(1, 5);
      let itinv = data.items.find((i) => i.id === item.id);
      itinv.amount += amount;
      await data.save();
      return `WTF you got **${amount} ${item.emoji} ${item.name}**${
        amount > 1 ? 's' : ''
      } that was lucky asf`;
    } else if (odds >= 0.5) {
      const won = util.randomNumber(100, 1000) * 1e3;
      await msg.author.initDB(data).addPocket(won).calcSpace().db.save();
      return `GG! You got **${won.toLocaleString()}** coins from begging to me, congrats i guess.`;
    }

    return { replyTo: msg.id, content: 'LOL no thanks' };
  }
}
