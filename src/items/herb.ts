import { Item } from 'lib/handlers/item';

export default class Flex extends Item {
  constructor() {
    super('herb', {
      category: 'Flex',
      sellable: false,
      buyable: true,
      usable: false,
      emoji: ':herb:',
      name: "Ken's Herbal Supplement",
      cost: 1e6,
      info: {
        short: 'Just a flex from the man himself.',
        long: 'Nothing, just for his fucking treatment to fix himself.',
      },
    });
  }
}
