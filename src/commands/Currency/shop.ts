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
    });
  }

  async exec(msg: Message): Promise<string | MessageOptions> {
    const { item: Handler } = this.client.handlers;
    const items = Handler.modules.array();
    const shop = new Embed();

    const itemMap = items.map(
      (i) =>
        `**${i.emoji} ${i.name}** — [${i.cost.toLocaleString()}](https://discord.gg/memer)\n**${
          i.categoryID
        }** ${i.info}`
    );
    const fields = this.client.util.paginateArray(itemMap, 5);
    shop.setDescription(fields[0].join('\n\n')).setTitle('Test Shop');
    return { embed: shop };
  }
}
