import { MessageOptions } from 'discord.js';
import { MessagePlus } from '@lib/extensions/message';
import { Command } from '@lib/handlers/command';
import { Embed } from '@lib/utility/embed';
import { Item } from '@lib/handlers/item';

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
          type: (msg: MessagePlus, phrase: string) => {
            if (!phrase) return 1; // shop page
            const { resolver } = this.handler;
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
    msg: MessagePlus,
    { query }: { query: number | Item }
  ): Promise<string | MessageOptions> {
    const { item: Handler } = this.client.handlers;
    const items = Handler.modules.array();
    const embed = new Embed();

    if (typeof query === 'number') {
      const { paginateArray, parseTime } = this.client.util;
      const sItem = Handler.modules.get(Handler.sale.id);
      const from = Date.now() - Handler.saleInterval;
      const left = parseTime(Math.round(Handler.sale.lastSale - from) / 1e3);

      function displayItem(i: Item, sale: number = 0 /* 0 just to be safe */) {
        const { emoji, cost, info } = i;
        const saleCost = Handler.sale.id === i.id 
          ? Math.round(cost - (cost * (sale / 100)))
          : cost;

        const coss = `[${saleCost.toLocaleString()}](https://google.com) ${Handler.sale.id === i.id ? `( [***${sale}% OFF!***](https://google.com) )` : ''}`;
        return `**${emoji} ${i.name}** — ${coss}\n${sale >= 1 ? `*${info.long}*` : info.short}`;
      }

      const shop = paginateArray(items.sort((a, b) => b.cost - a.cost).map((i) => displayItem(i, 0)), 5);
      if (query > shop.length) return "That page doesn't even exist lol";
      
      embed
        .addField(`**__LIGHTNING SALE__** (resets in ${left})`, displayItem(sItem, Handler.sale.discount))
        .addField('Shop Items', shop[(query as number) - 1].join('\n\n'))
        .setFooter(false, `Lava Shop — Page ${query} of ${shop.length}`)
        .setTitle('Lava Shop')
        .setColor('RANDOM');
    } else {
      if (!query)
        return "That item doesn't even exist in the shop what're you doing?";
      const data = await msg.author.fetchDB();
      const inv = data.items.find((i) => i.id === query.id);

      let info: string[] = [];
      info.push(
        `**Item Price** — ${
          query.buyable
          ? query.id === Handler.sale.id
            ? Math.round(query.cost - (query.cost * (Handler.sale.discount / 100))).toLocaleString()
            : query.cost.toLocaleString()
          : '**Not Purchaseable**'
        }`
      );
      info.push(
        `**Sell Price** — ${(query.sellable
          ? query.cost / 4
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
