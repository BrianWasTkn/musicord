import { MessageOptions } from 'discord.js';
import { MessagePlus } from '@lib/extensions/message';
import { Command } from '@lib/handlers/command';
import { Item } from '@lib/handlers/item';
import Constants from '@lib/utility/constants';

export default class Currency extends Command {
  constructor() {
    super('buy', {
      aliases: ['buy', 'purchase'],
      channel: 'guild',
      description: 'Buy something from the shop.',
      category: 'Currency',
      cooldown: 3e3,
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
    const { ITEM_MESSAGES: MESSAGES } = Constants;
    const { amount = 1, item } = args;
    const { maxInventory } = this.client.config.currency;
    const { item: Items } = this.client.handlers;
    const data = await msg.author.fetchDB();

    if (!item) return MESSAGES.NEED_TO_BUY;

    let inv = data.items.find((i) => i.id === item.id);

    if (amount < 1) 
      return MESSAGES.AMOUNT_BELOW_ONE;
    if (!item.buyable) 
      return MESSAGES.NOT_BUYABLE;
    if (data.pocket < item.cost)
      return MESSAGES.BROKE_TO_BUY;
    if (data.pocket < amount * item.cost)
      return MESSAGES.NOT_BUYABLE_BULK
    if (inv.amount >= maxInventory)
      return MESSAGES.INVENTORY_IS_FULL;

    const paid = Items.sale.id === item.id 
      ? Math.round(item.cost - (item.cost * (Items.sale.discount / 1e2)))
      : item.cost;
      
    await Items.buy(Math.trunc(amount), data, item.id);
    this.client.handlers.quest.emit('itemBuy', { msg, item, amount });

    return { replyTo: msg.id, embed: {
      footer: { text: 'Thanks for your purchase!' },
      color: 'GREEN',
      author: {
        name: `Successful ${item.name} purchase`,
        iconURL: msg.author.avatarURL({ dynamic: true })
      },
      description: Constants.ITEM_MESSAGES.BUY_MSG
        .replace(/{paid}/gi, (amount * paid).toLocaleString())
        .replace(/{amount}/gi, Math.trunc(amount).toLocaleString())
        .replace(/{emoji}/gi, item.emoji)
        .replace(/{item}/gi, item.name)
    }};
  }
}
