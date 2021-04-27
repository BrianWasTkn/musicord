import { MessageOptions } from 'discord.js';
import { Context } from 'lib/extensions/message';
import { Command } from 'lib/handlers/command';
import { Embed } from 'lib/utility/embed';
import { Item } from 'lib/handlers/item';

export default class Currency extends Command {
  constructor() {
    super('shop', {
      aliases: ['shop', 'item', 'store'],
      channel: 'guild',
      description: 'View or buy something from the shop.',
      category: 'Currency',
      args: [
        {
          id: 'query',
          type: (msg: Context, phrase: string) => {
            const { resolver } = this.handler;
            if (!phrase) return 1; // shop page
            return Number(phrase) || resolver.type('shopItem')(msg, phrase);
          },
        },
      ],
    });
  }

  async exec(
    ctx: Context<{ query: number | Item }>
  ): Promise<MessageOptions> {
    const { item: Handler } = this.client.handlers;
    const { query } = ctx.args;
    const items = Handler.modules.array();

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
        const { name, emoji, cost, info, premium } = i;
        const { discount, id } = Handler.sale;
        const dCounted = Math.round(cost - cost * (discount / 100));
        const price = id === i.id ? dCounted : cost;

        return `**${emoji} ${
          name
        }** — :${premium ? 'key' : 'coin'}: [${
          (premium ? cost : price).toLocaleString()
        }](https://google.com)\n${
          info.short
        }`;
      }

      function sort(a: Item, b: Item) {
        return b.moddedPrice - a.moddedPrice;
      }

      const shop = paginateArray(items.sort(sort).map(displayItem), 5);
      if (query > shop.length) {
        return { replyTo: ctx.id, content: "That page doesn't even exist lol" };
      }

      return { embed: {
        title: 'Lava Shop', color: 'RANDOM', footer: {
          text: `Lava Shop — Page ${query} of ${shop.length}`
        }, fields: [
          { 
            name: `**__LIGHTNING SALE__** (resets in ${left})`,
            value: displaySaleItem(Handler.sale.id, Handler.sale.discount)
          },
          {
            name: 'Shop Items',
            value: shop[(query as number) - 1].join('\n\n')
          }
        ]
      }};
    }

    if (!query) {
      return { replyTo: ctx.id, content: "**That item:** doesn't exist" };
    }

    const { data } = await ctx.db.fetch();
    const inv = query.findInv(data.items, query);

    function calc(amount: number, discount: number) {
      return amount - amount * (discount / 1e2);
    }
    function getIcon(i: Item) {
      return `:${i.premium ? 'key' : 'coin'}:`;
    }

    const { id, discount } = Handler.sale;
    const buy = query.premium
      ? query.cost : query.id === id
        ? Math.round(calc(query.cost, discount))
        : query.cost;
    const sell = query.premium
      ? Math.round(query.cost / 4) : query.id === id
        ? Math.round(calc(query.cost / 4, discount))
        : Math.round(query.cost / 4);

    let info: string[] = [];
    info.push(
      `**Item Price** — ${getIcon(query)} ${
        query.buyable ? buy.toLocaleString() : '**Not Purchaseable**'
      }`
    );
    info.push(
      `**Sell Price** — ${getIcon(query)} ${(query.sellable
        ? sell.toLocaleString()
        : '**Not Sellable**'
      ).toLocaleString()}`
    );

    return { embed: {
      title: `${query.emoji} ${query.name} — ${inv.amount.toLocaleString()} Owned`,
      fields: [ { name: 'Item Info', value: info.join('\n') } ],
      color: 'RANDOM', description: query.info.long, 
    }};
  }
}
