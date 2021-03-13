import { Message, MessageOptions } from 'discord.js';
import { Command } from '@lib/handlers/command';
import { Embed } from '@lib/utility/embed';
import { Item } from '@lib/handlers/item';

export default class Currency extends Command {
  constructor() {
    super('buy', {
      aliases: ['buy', 'purchase'],
      channel: 'guild',
      description: 'Buy something from the shop.',
      category: 'Currency',
      cooldown: 1000,
      args: [
        {
          id: 'item',
          type: 'shopItem',
          unordered: true,
        },
        {
          id: 'amount',
          type: 'number',
          unordered: true,
          default: 1,
        },
      ],
    });
  }

  async exec(
    msg: Message,
    args: {
      amount: number;
      item: Item;
    }
  ): Promise<string | MessageOptions> {
    const { amount = 1, item } = args;
    const { item: Items } = this.client.handlers;
    const { maxInv } = this.client.config.currency;
    const { fetch } = this.client.db.currency;
    const send = msg.channel.send.bind(msg.channel);
    const data = await fetch(msg.author.id);
    let inv = data.items.find((i) => i.id === item.id);

    if (!item) {
      return 'You need something to buy';
    }

    if (!inv) {
      data.items.push({
        active: false,
        id: item.id,
        amount: 0,
        expire: 0
      });

      await data.save();
      inv = data.items.find((i) => i.id === item.id);
    }

    if (!amount || amount < 1) return 'Imagine buying none.';
    else if (!item.buyable) return "You can't buy this item what?";
    else if (data.pocket < item.cost)
      return "You're too broke to buy this item!";
    else if (data.pocket < amount * item.cost)
      return "You don't have enough to bulk this item on bulk!";
    else if (inv.amount >= maxInv)
      return `You already have enough of this item (${maxInv.toLocaleString()})!`;

    const { paid, amount: amt, data: dat, item: i } = await Items.buy(
      amount,
      msg.author.id,
      item.id
    );
    const embed = new Embed()
      .setDescription(
        `Succesfully purchased \`${amt.toLocaleString()}\` **${i.name}**${
          amt > 1 ? 's' : ''
        } and paid \`${paid.toLocaleString()}\` coins.`
      )
      .setAuthor('Successful purchase', msg.author.avatarURL({ dynamic: true }))
      .setColor('GREEN');

    return { embed };
  }
}
