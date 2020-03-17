import { Message, MessageOptions } from 'discord.js';
import { Argument } from 'discord-akairo'
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
      args: [{
        id: 'page',
        type: Argument.union('number', 'shopItem'),
        default: 1
      }]
    });
  }

  async exec(msg: Message, { query }: { query: number | Item }): Promise<string | MessageOptions> {
    const { item: Handler } = this.client.handlers;
    const items = Handler.modules.array();
    const embed = new Embed();
    const data = await this.client.db.currency.fetch(msg.author.id);

    if (typeof query === 'number') {
      const shop = this.client.util
      .paginateArray(items
        .sort((a, b) => b.cost - a.cost)
        .map(i => {
          const { emoji, cost, info } = i;
          return `**${emoji} ${i.name}** — [${cost.toLocaleString()}](https://discord.gg/memer)\n${info}`
      }), 3);

      embed.setFooter(false, `Lava Shop — Page ${query} of ${shop.length}`)
      .addField('Shop Items', shop[query as number - 1].join('\n\n'))
      .setTitle('Lava Shop')
      .setColor('RANDOM');

      if (query > shop.length) return 'That page doesn\'t even exist lol';
    } else {
      if (!query) return 'That item doesn\'t even exist in the shop what\'re you doing?'
      const inv = data.items.find(i => i.id === query.id);
      if (!inv) await this.client.db.currency.updateItems(msg.author.id);
      
      let info: string[];
      info.push(`**Item Price** — ${query.buyable ? query.cost.toLocaleString() : '**cannot be purchased**'}`);
      info.push(`**Sell Price** — ${(query.cost / 4).toLocaleString()}`);

      embed.setTitle(`${query.name} — ${inv.amount} Owned`)
        .addField('Description', query.info)
        .addField('Item Info', info.join('\n'))
        .setColor('RANDOM');
    }

    return { embed };
  }
}
