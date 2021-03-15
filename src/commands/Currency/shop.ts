import { Message, MessageOptions } from 'discord.js';
import { Command } from '@lib/handlers/command';
import { Embed } from '@lib/utility/embed';

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
        type: 'number',
        default: 1
      }]
    });
  }

  async exec(msg: Message, { page }: { page: number }): Promise<string | MessageOptions> {
    const { item: Handler } = this.client.handlers;
    const items = Handler.modules.array();

    const shop = this.client.util
    .paginateArray(items
      .sort((a, b) => b.cost - a.cost)
      .map(i => {
        const { emoji, cost, categoryID, info } = i;
        return `**${emoji} ${i.name}**\n**Use:** ${info}\n**Cost:** ${cost.toLocaleString()}\n**Type:** ${categoryID}`
    }), 3);

    if (page > shop.length)
      return 'That page doesn\'t even exist lol';

    const embed = new Embed()
      .setDescription(shop[page - 1].join('\n\n'))
      .setFooter(false, `Lava Shop — Page ${page} of ${shop.length}`)
      .setTitle('Lava Shop')
      .setColor('RANDOM');

    return { embed };
  }
}
