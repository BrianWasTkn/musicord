import { MessagePlus } from '@lib/extensions/message'
import { Item } from '@lib/handlers/item';

export default class Flex extends Item {
  constructor() {
    super('donut', {
      category: 'Flex',
      sellable: false,
      buyable: true,
      usable: true,
      emoji: ':doughnut:',
      name: "Donut Ring",
      cost: 100e6,
      info: {
        short: 'They say this item is the key for a great relationship.',
        long: 'Either eat it (doesn\'t deduct) or use it to marry someone!',
      }
    });
  }

  use() {
    return `${this.emoji} You ate sum yummy donuts! Nom Omm Onm`;
  }
}
