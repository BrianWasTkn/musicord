import { Item } from '@lib/handlers/item';

export default class Flex extends Item {
  constructor() {
    super('ring1', {
      category: 'Flex',
      sellable: false,
      buyable: true,
      usable: false,
      emoji: ':doughnut:',
      info: 'Either eat it or use it to marry someone!',
      name: "Donut Ring",
      cost: 100e6,
    });
  }
}
