import { MessageOptions } from 'discord.js';
import { Context } from 'lib/extensions/message';
import { Command } from 'lib/handlers/command';
import config from 'config/index' ;
import { Item } from 'lib/handlers/item';
import Constants from 'lib/utility/constants';

export default class Currency extends Command {
  constructor() {
    super('buy', {
      aliases: ['buy', 'purchase'],
      channel: 'guild',
      description: 'Buy something from the shop.',
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
    ctx: Context<{
      amount: number;
      item: Item;
    }>
  ): Promise<string | MessageOptions> {
    const { ITEM_MESSAGES: MESSAGES } = Constants;
    const { amount = 1, item } = ctx.args;
    const { maxInventory } = config.currency;
    const { item: Items } = this.client.handlers;
    const userEntry = await ctx.db.fetch();
    const data = userEntry.data; // no destruct coz style owo

    if (!item) return MESSAGES.NEED_TO_BUY;

    let inv = data.items.find((i) => i.id === item.id);
    if (amount < 1) return MESSAGES.AMOUNT_BELOW_ONE;
    if (!item.buyable) return MESSAGES.NOT_BUYABLE;
    if (data.pocket < item.cost) return MESSAGES.BROKE_TO_BUY;
    if (data.pocket < amount * item.cost) return MESSAGES.NOT_BUYABLE_BULK;
    if (amount > maxInventory) return MESSAGES.AMOUNT_CAP;
    if (inv.amount >= maxInventory) return MESSAGES.INVENTORY_IS_FULL;

    const isSale = Items.sale.id === item.id;
    const dPrice = Math.round(item.cost - item.cost * (Items.sale.discount / 1e2));
    const paid = amount * (isSale ? dPrice : item.cost);
    await userEntry.removePocket(Math.round(paid)).addInv(item.id, Math.round(amount)).save();
    this.client.handlers.quest.emit('itemBuy', { ctx, item, amount });

    return { replyTo: ctx.id, embed: {
      author: { name: `Successful ${item.name} purchase`, iconURL: ctx.author.avatarURL({ dynamic: true }) },
      footer: { text: 'Thanks for your purchase!' }, color: 'GREEN', 
      description: Constants.ITEM_MESSAGES.BUY_MSG.replace(
        /{paid}/gi,
        Math.round(paid).toLocaleString()
      )
        .replace(/{amount}/gi, Math.trunc(amount).toLocaleString())
        .replace(/{emoji}/gi, item.emoji)
        .replace(/{item}/gi, item.name),
    }};
  }
}
