import { MessageOptions } from 'discord.js';
import { Context } from 'lib/extensions/message';
import { Command } from 'lib/handlers/command';
import { Embed } from 'lib/utility/embed';
import { Item } from 'lib/handlers/item';

export default class Currency extends Command {
  constructor() {
    super('shop', {
      aliases: ['shop', 'item'],
      channel: 'guild',
      description: 'View or buy something from the shop.',
      category: 'Currency',
      cooldown: 1000,
      args: [
        {
          id: 'query',
          type: (msg: Context, phrase: string) => {
            const { resolver } = this.handler;
            if (!phrase) return 1; // shop page
            return (
              resolver.type('number')(msg, phrase) ||
              resolver.type('shopItem')(msg, phrase)
            );
          },
        },
      ],
    });
  }

  async exec(
    ctx: Context<{ query: number | Item }>
  ): Promise<string | MessageOptions> {
    const { item: Handler } = this.client.handlers;
    const { query } = ctx.args;
    const items = Handler.modules.array();
    const embed = new Embed();

    if (typeof query === 'number') {
      const { paginateArray, parseTime } = this.client.util;
      const sItem = Handler.modules.get(Handler.sale.id);
      const from = Date.now() - Handler.saleInterval;
      const left = parseTime(Math.round(Handler.sale.lastSale - from) / 1e3);

      function displaySaleItem(it: string, discount: number) {
        const item = Handler.modules.get(it);
        const { emoji, cost, info } = item;
        const saleCost = Math.round(cost - cost * (discount / 1e2));
        const off = `[${saleCost.toLocaleString()}](https://google.com) ( [***${discount}% OFF!***](https://google.com) )`;

        return `**${emoji} ${item.name}** — ${off}\n*${info.long}*`;
      }

      function displayItem(i: Item) {
        const { emoji, cost, info } = i;
        const { discount, id } = Handler.sale;
        const price =
          id === i.id ? Math.round(cost - cost * (discount / 100)) : cost;

        return `**${emoji} ${
          i.name
        }** — [${price.toLocaleString()}](https://google.com)\n${info.short}`;
      }

      const shop = paginateArray(
        items.sort((a, b) => b.cost - a.cost).map(displayItem),
        5
      );
      if (query > shop.length) return "That page doesn't even exist lol";

      embed
        .addField(
          `**__LIGHTNING SALE__** (resets in ${left})`,
          displaySaleItem(Handler.sale.id, Handler.sale.discount)
        )
        .addField('Shop Items', shop[(query as number) - 1].join('\n\n'))
        .setFooter(false, `Lava Shop — Page ${query} of ${shop.length}`)
        .setTitle('Lava Shop')
        .setColor('RANDOM');
    } else {
      if (!query)
        return "That item doesn't even exist in the shop what're you doing?";
      const data = (await ctx.db.fetch()).data;
      const inv = data.items.find((i) => i.id === query.id);

      function calc(amount: number, discount: number) {
        return amount - amount * (discount / 1e2);
      }

      const { id, discount } = Handler.sale;
      const buy =
        query.id === id ? Math.round(calc(query.cost, discount)) : query.cost;
      const sell =
        query.id === id
          ? Math.round(calc(query.cost / 4, discount))
          : Math.round(query.cost / 4);

      let info: string[] = [];
      info.push(
        `**Item Price** — ${
          query.buyable ? buy.toLocaleString() : '**Not Purchaseable**'
        }`
      );
      info.push(
        `**Sell Price** — ${(query.sellable
          ? sell.toLocaleString()
          : '**Not Sellable**'
        ).toLocaleString()}`
      );

      embed
        .setTitle(
          `${query.emoji} ${query.name} — ${inv.amount.toLocaleString()} Owned`
        )
        .addField('Description', query.info.long)
        .addField('Item Info', info.join('\n'))
        .setColor('RANDOM');
    }

    return { embed };
  }
}
