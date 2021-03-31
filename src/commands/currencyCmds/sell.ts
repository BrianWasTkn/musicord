import { MessageOptions } from 'discord.js';
import { MessagePlus } from '@lib/extensions/message';
import { Command } from '@lib/handlers/command';
import { Embed } from '@lib/utility/embed';
import { Item } from '@lib/handlers/item';
import Constants from '@lib/utility/constants';

export default class Currency extends Command {
  constructor() {
    super('sell', {
      aliases: ['sell'],
      channel: 'guild',
      description: 'Sell something to the shop.',
      category: 'Currency',
      cooldown: 1000,
      args: [
        {
          id: 'item',
          type: 'shopItem',
        },
        {
          id: 'amount',
          type: 'number',
          default: 1,
        },
      ],
    });
  }

  async exec(
    msg: MessagePlus,
    args: {
      amount: number;
      item: Item;
    }
  ): Promise<string | MessageOptions> {
    const { amount = 1, item } = args;
    const { maxInventory } = this.client.config.currency;
    const { item: Items } = this.client.handlers;
    const { fetch } = this.client.db.currency;
    const data = await msg.author.fetchDB();

    if (!item) return 'You need something to sell';

    let inv = data.items.find((i) => i.id === item.id);
    if (amount < 1) 
      return 'Imagine selling none.';
    if (!item.sellable) 
      return "You can't sell this item rip";
    if (amount > inv.amount) 
      return "You can't fool me";

    await Items.sell(Math.trunc(amount), data, item.id);
    this.client.handlers.quest.emit('itemSell', { msg, item, amount });

    return { replyTo: msg.id, embed: {
      color: 'GREEN',
      description: Constants.ITEM_MESSAGES.SELL
        .replace(/{got}/gi, (amount * (item.cost / 4)).toLocaleString())
        .replace(/{amount}/gi, Math.trunc(amount).toLocaleString())
        .replace(/{emoji}/gi, item.emoji)
        .replace(/{item}/gi, item.name),
      author: {
        name: 'Item Sold',
        iconURL: msg.author.avatarURL({ dynamic: true })
      },
    }};
  }
}
