import { MessageOptions } from 'discord.js';
import { MessagePlus } from '@lib/extensions/message';
import { Command } from '@lib/handlers/command';
import { Embed } from '@lib/utility/embed';
import { Item } from '@lib/handlers/item';

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
    const { item: Items } = this.client.handlers;
    const { maxInventory } = this.client.config.currency;
    const { fetch } = this.client.db.currency;
    const data = await msg.author.fetchDB();

    if (!item) return 'You need something to sell';

    let inv = data.items.find((i) => i.id === item.id);
    if (amount < 1) return 'Imagine selling none.';
    else if (!item.sellable) return "You can't sell this item rip";
    else if (amount > inv.amount) return "You can't fool me";

    await Items.sell(Math.trunc(amount), data, item.id);
    const embed = new Embed()
      .setDescription(
        `Succesfully sold **${amount.toLocaleString()} ${item.name}**${
          amount > 1 ? 's' : ''
        } and got \`${Math.round(amount * (item.cost / 4)).toLocaleString()}\`.`
      )
      .setAuthor('Item Sold', msg.author.avatarURL({ dynamic: true }))
      .setColor('GREEN');

    return { embed };
  }
}
