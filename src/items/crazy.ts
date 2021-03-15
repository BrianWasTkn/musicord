import { Message } from 'discord.js';
import { Item } from '@lib/handlers/item';

export default class PowerUp extends Item {
  constructor() {
    super('crazy', {
      category: 'Power-Up',
      sellable: false,
      buyable: true,
      usable: true,
      emoji: ':beers:',
      info: "Gives a 5% chance of getting jackpot on slots for 10 minutes!",
      name: "Crazy's Alcohol",
      cost: 2500000,
    });
  }

  async use(msg: Message): Promise<string> {
    const data = await this.client.db.currency.fetch(msg.author.id);
    const craz = data.items.find((i) => i.id === this.id);

    craz.amount -= 1;
    craz.active = true;
    craz.expire = Date.now() + (10 * 60 * 1e3);
    await data.save();

    return "You now have a 5% chance of winning jackpots on slots for 10 minutes.";
  }
}
