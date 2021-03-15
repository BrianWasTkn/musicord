import { Message, MessageOptions } from 'discord.js';
import { Command } from '@lib/handlers/command';
import { Embed } from '@lib/utility/embed';
import { Item } from '@lib/handlers/item';

export default class Currency extends Command {
  constructor() {
    super('use', {
      aliases: ['use', 'consume'],
      channel: 'guild',
      description: 'Use an item you own.',
      category: 'Currency',
      cooldown: 1000,
      args: [
        {
          id: 'item',
          type: 'shopItem',
        },
      ],
    });
  }

  async exec(
    msg: Message,
    args: {
      item: Item;
    }
  ): Promise<string | MessageOptions> {
    const { item: Items } = this.client.handlers;
    const { fetch } = this.client.db.currency;
    if (!args.item) return "This item doesn't exist :thinking:";

    const isPromise = this.client.util.isPromise.bind(this.client.util);
    const data = await fetch(msg.author.id);
    const { item } = args;

    const inv = data.items.find((i) => i.id === item.id);
    if (!inv || inv.amount < 1) return "You don't have this item";
    if (inv.active) return 'This item is currently active right now.';
    if (!item.usable) return 'LOL you can\'t use this item :thinking:'

    const ret = await item.use(msg);
    return { content: ret, reply: msg.author.id };
  }
}
