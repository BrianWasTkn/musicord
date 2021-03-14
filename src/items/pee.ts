import { Message } from 'discord.js';
import { Item } from '@lib/handlers/item';

export default class PowerUp extends Item {
  constructor() {
    super('pee', {
      category: 'Power-Up',
      sellable: false,
      buyable: true,
      usable: false,
      emoji: ':baby_bottle:',
      info: 'Having jenni\'s pee grants you good luck!',
      name: 'Jenni\'s Piss',
      cost: 10000000,
    });
  }

  async use(msg: Message): Promise<string> {
    const data = await this.client.db.currency.fetch(msg.author.id);
    data.items.find(i => i.id === this.id).amount -= 1;
    await data.save();
		return 'You drank jenni\'s urinary substance, now what?';
  }
}
