import { MessageOptions } from 'discord.js';
import { MessagePlus } from '@lib/extensions/message';
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
    msg: MessagePlus,
    args: {
      item: Item;
    }
  ): Promise<string | MessageOptions> {
    const { item: Items } = this.client.handlers;
    const data = await msg.author.fetchDB();

    const { item } = args;
    if (!item) return "This item doesn't exist :thinking:";

    const inv = data.items.find((i) => i.id === item.id);
    if (!inv || inv.amount < 1) return "LOL you don't own this item :skull:";
    if (inv.expire > Date.now()) return 'This item is currently active right now.';
    if (!item.usable) return "You can't use this item :thinking:";

    const queue = this.client.util.cmdQueue;
    const id = msg.author.id;

    queue.set(id, true); // exploit protection
    const ret = await item.use(msg);
    if (queue.has(id)) queue.delete(id);

    return { content: ret, replyTo: msg.id };
  }
}
