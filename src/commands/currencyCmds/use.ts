import { MessageOptions } from 'discord.js';
import { Item, IReturn } from '@lib/handlers/item';
import { MessagePlus } from '@lib/extensions/message';
import { Command } from '@lib/handlers/command';
import { Embed } from '@lib/utility/embed';

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

    // queue.set(id, true); // exploit protection
    const ret = await item.use(msg);
    // if (queue.has(id)) queue.delete(id);

    if (ret.constructor === String) return ret as string;

    const yes: MessageOptions = {};
    const r = ret as IReturn;
    if (r.embed) yes.embed = r.embed;
    if (r.content) yes.content = r.content;
    if ('reply' in r) yes.replyTo = msg.id;

    return { ...yes, allowedMentions: { repliedUser: r.reply }};
  }
}
