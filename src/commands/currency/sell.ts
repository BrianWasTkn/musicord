import { MessageOptions } from 'discord.js';
import { Context } from 'lib/extensions/message';
import { Command } from 'lib/handlers/command';
import { Item } from 'lib/handlers/item';
import Constants from 'lib/utility/constants';

export default class Currency extends Command {
  constructor() {
    super('sell', {
      aliases: ['sell'],
      channel: 'guild',
      description: 'Sell something to the shop.',
      category: 'Currency',
      cooldown: 500,
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
    ctx: Context<{ amount: number; item: Item }>
  ): Promise<string | MessageOptions> {
    const { ITEM_MESSAGES: MESSAGES } = Constants;
    const { amount = 1, item } = ctx.args;
    const { item: Items } = this.client.handlers;
    const userEntry = await ctx.db.fetch();
    const data = userEntry.data;

    if (!item) return MESSAGES.NEED_TO_SELL;

    let inv = data.items.find((i) => i.id === item.id);
    if (amount < 1) return MESSAGES.SELLING_NONE;
    if (!item.sellable) return MESSAGES.NOT_SELLABLE;
    if (amount > inv.amount) return MESSAGES.CANT_FOOL_ME;

    const isSale = Items.sale.id === item.id;
    const dPrice = Math.round(item.cost - item.cost * (Items.sale.discount / 1e2));
    const sold = Math.round(amount * ((isSale ? dPrice : item.cost) / 4));
    await userEntry.addPocket(Math.round(sold)).removeInv(item.id, Math.round(amount)).save();
    this.client.handlers.quest.emit('itemSell', { ctx, item, amount });

    return {
      replyTo: ctx.id,
      embed: {
        color: 'GREEN',
        author: {
          name: `${item.name} successfully sold`,
          iconURL: ctx.author.avatarURL({ dynamic: true }),
        },
        description: Constants.ITEM_MESSAGES.SELL_MSG.replace(
          /{got}/gi,
          Math.round(sold).toLocaleString()
        )
          .replace(/{amount}/gi, Math.trunc(amount).toLocaleString())
          .replace(/{emoji}/gi, item.emoji)
          .replace(/{item}/gi, item.name),
      },
    };
  }
}
