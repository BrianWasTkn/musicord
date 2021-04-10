import { Item } from '@lib/handlers/item';

export default class Flex extends Item {
  constructor() {
    super('herb', {
      category: 'Flex',
      sellable: false,
      buyable: true,
      usable: false,
      emoji: ':herb:',
      info: 'Just a flex from the man himself.',
      name: "Ken's Herbal Supplement",
      cost: 42000000,
    });
  }
}
