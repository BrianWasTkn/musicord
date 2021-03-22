import { Message } from 'discord.js';
import { Item } from '@lib/handlers/item';

export default class PowerUp extends Item {
  constructor() {
    super('crazy', {
      category: 'Power-Up',
      sellable: true,
      buyable: true,
      usable: true,
      emoji: ':beers:',
      info: "Gives a 10% chance of getting jackpot on slots for 10 minutes!",
      name: "Crazy's Alcohol",
      cost: 2500000,
    });
  }

  async use(msg: Message): Promise<string> {
    const data = await this.client.db.currency.fetch(msg.author.id);
    const craz = data.items.find((i) => i.id === this.id);

    craz.amount--;
    craz.expire = Date.now() + (10 * 60 * 1e3);
    await data.save();

    return "You now have a **10% chance of winning jackpots in slots** for 10 minutes.";
  }
}
