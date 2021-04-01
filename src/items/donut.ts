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
      info: 'Either eat it or use it to marry someone!',
      name: "Donut Ring",
      cost: 100e6,
    });
  }

  use() {
    return 'You ate some yummy donuts! nom omm nom';
  }
}