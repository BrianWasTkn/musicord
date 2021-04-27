import { Context } from 'lib/extensions/message';
import { MessageOptions } from 'discord.js';
import { Item } from 'lib/handlers/item';

export default class Flex extends Item {
  constructor() {
    super('donut', {
      category: 'Flex',
      sellable: false,
      buyable: true,
      usable: true,
      emoji: ':doughnut:',
      name: 'Donut Ring',
      cost: 100e6,
      tier: 3,
      info: {
        short: 'They say this item is the key for a great relationship.',
        long: "Either eat it (doesn't deduct) or use it to marry someone!",
      },
    });
  }

  use(): MessageOptions {
    return { replyTo: ctx.id, content: `${this.emoji} You ate sum yummy donuts! Nom Omm Onm` };
  }
}
