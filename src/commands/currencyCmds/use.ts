import { MessageOptions } from 'discord.js';
import { InventorySlot } from '@lib/interface/handlers/item';
import { Item, IReturn } from '@lib/handlers/item';
import { Context } from '@lib/extensions/message';
import { Command } from '@lib/handlers/command';

export default class Currency extends Command {
  constructor() {
    super('use', {
      aliases: ['use', 'consume'],
      channel: 'guild',
      description: 'Use an item you own.',
      category: 'Currency',
      cooldown: 5e3,
      args: [
        {
          id: 'item',
          type: 'shopItem',
        },
      ],
    });
  }

  async exec(ctx: Context<{ item: Item }>): Promise<string | MessageOptions> {
    const { parseTime } = ctx.client.util;
    const { data } = await ctx.db.fetch();
    const { item } = ctx.args;
    if (!item) return "This item doesn't exist :skull:";

    const inv = data.items.find((i) => i.id === item.id);
    function check(inv: InventorySlot) {
      let state = false;
      switch(true) {
        case !inv || inv.amount < 1:
          return { state, m: "You don't own this item!" };
        case inv.expire > Date.now():
          return { state, m: `This item is active right now. You can use it again in ${parseTime((Date.now() - inv.expire) / 1e3)}` };
        case !item.usable:
          return { state, m: "You can't use this item :thinking:" };
        default: 
          return { state: true, m: null };
      }
    }

    if (!check(inv).state) {
      return { replyTo: ctx, content: check(inv).m };
    }

    const ret = await item.use(ctx);
    if (ret.constructor === String) return ret as string;

    const yes: MessageOptions = {};
    const r = ret as IReturn;
    if (r.embed) yes.embed = r.embed;
    if (r.content) yes.content = r.content;
    if ('reply' in r) yes.replyTo = ctx.id;

    return { ...yes, allowedMentions: { repliedUser: r.reply }};
  }
}
