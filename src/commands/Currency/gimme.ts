import { Command } from '@lib/handlers/command';
import { Message } from 'discord.js';
import { Item } from '@lib/handlers/item'

export default class Currency extends Command {
  constructor() {
    super('gimme', {
      aliases: ['gimme'],
      channel: 'guild',
      description: 'Gives you a random amount of coins from 100k to 1m coins',
      category: 'Currency',
      cooldown: 60000,
    });
  }

  async exec({ author, channel }: Message): Promise<string> {
    const { db, config, util, handlers } = this.client;
    const { fetch, add, updateItems } = db.currency;
    const data = await fetch(author.id);
    const items = handlers.item.modules;

    const type = util.randomInArray(['pocket', 'item']);
    const odds = Math.random();

    if (odds <= 0.3) {
      return 'You got nothing lmao.'
    }

    let gimme: number | Item;
    if (odds >= 0.85) {
      const item = items.random();
      const amount = util.randomNumber(1, 5);
      let itinv = data.items.find(i => i.id === item.id);
      if (!itinv) {
        await updateItems(author.id);
        itinv = data.items.find(i => i.id === item.id);
      }

      itinv.amount += amount;
      await data.save();
      return `WTF you got **${amount} ${item.emoji} ${item.name}**${amount > 1 ? 's' : ''} that was lucky asf`
    } else if (odds >= 0.25) {
      const won = util.randomNumber(100, 500) * 1e3;
      await add(author.id, 'pocket', won);
      return `GG! You got **${won.toLocaleString()}** coins from begging to me, congrats i guess.`
    }

    return 'Nah i\'d rather give this to the poor.'
  }
}
