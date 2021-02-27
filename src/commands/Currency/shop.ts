import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'discord-akairo';
import { Lava } from '@lib/Lava';

export default class Currency extends Command {
  client: Lava;

  constructor() {
    super('shop', {
      aliases: ['shop', 'item'],
      channel: 'guild',
      description: 'View or buy something from the shop.',
      category: 'Currency',
      cooldown: 1000,
    });
  }

  async exec(msg: Message): Promise<Message> {
    const { item: Handler } = this.client.handlers;
    const items = Handler.modules.array();
    const shop = new MessageEmbed();
    const fields = items.map(i => ({
      name: `**__${i.emoji} ${i.id}__**`,
      value: [
        `**Cost:** ${i.cost.toLocaleString()}`,
        `**Type:** ${i.category.id}`,
        `**Info:** ${i.info}`,
      ].join('\n')
    }))

    shop.addFields(fields).setTitle('Test Shop');
    return msg.channel.send({ embed: shop });
  }
}
