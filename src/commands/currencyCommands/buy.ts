import { Context, ContextDatabase } from 'lib/extensions';
import { MessageOptions } from 'discord.js';
import { Command, Item } from 'lib/objects';
import { Argument } from 'discord-akairo';
import Constants from 'lib/utility/constants';
import config from 'config/index'; 

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
          type: Argument.union('number', 'string'),
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
    if (amount > maxInventory) return MESSAGES.AMOUNT_CAP;
    if (inv.amount >= maxInventory) return MESSAGES.INVENTORY_IS_FULL;
    if ((item.premium ? data.prem : data.pocket) < item.cost) return MESSAGES.BROKE_TO_BUY;
    if ((item.premium ? data.prem : data.pocket) < amount * item.cost) return MESSAGES.NOT_BUYABLE_BULK;

    const { id, discount } = Items.sale;
    const dPrice = Math.round(item.cost - item.cost * (discount / 1e2));
    const paid = item.premium ? item.cost * amount : id === item.id 
      ? amount * dPrice : amount * item.cost;

    if (item.premium) userEntry.removePremiumKeys(Math.round(paid));
    else userEntry.removePocket(Math.round(paid));
    await userEntry.updateQuest({ cmd: this, count: amount, item }).addInv(item.id, Math.round(amount)).save();

    return { replyTo: ctx.id, embed: {
      author: { name: `Successful "${item.name}" purchase`, iconURL: ctx.author.avatarURL({ dynamic: true }) },
      footer: { text: 'Thank you for your purchase!', iconURL: ctx.client.user.avatarURL() }, color: 'GREEN', 
      description: Constants.ITEM_MESSAGES.BUY_MSG(item.premium)
        .replace(/{paid}/gi, Math.round(paid).toLocaleString())
        .replace(/{amount}/gi, Math.trunc(amount).toLocaleString())
        .replace(/{emoji}/gi, item.emoji)
        .replace(/{item}/gi, item.name),
    }};
  }
}
