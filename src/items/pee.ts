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
      name: 'Jenni\'s Piss',
      info: 'Having jenni\'s pee grants you good luck!',
      cost: 10000000,
    });
  }

  use(msg: Message): string {
		return 'You\'ve been granted a great amount of luck from a bag of jenni\'s pees!';
  }
}
