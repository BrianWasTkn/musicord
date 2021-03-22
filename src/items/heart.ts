import { Message } from 'discord.js';
import { Item } from '@lib/handlers/item';

export default class Powerflex extends Item {
  constructor() {
    super('brian', {
      category: 'Powerflex',
      sellable: true,
      buyable: true,
      usable: true,
      emoji: ':brown_heart:',
      info: "Gives 50% multi, +25% winnings in gamble, +10% jackpot chance in slots ALL in 5 minutes.",
      name: "Brian's Heart",
      cost: 1250000,
    });
  }

  async use(msg: Message): Promise<string> {
    const { db, util } = this.client;
    const data = await db.currency.fetch(msg.author.id);
    const heart = data.items.find(i => i.id === this.id);
    const multi = 50;

    heart.expire = Date.now() + (5 * 60 * 1e3);
    heart.multi = 50;
    await data.save();

    return `You have been granted a **${multi}% multiplier, +25% winnings in gamble and +10% chance of jackpots in slots** for 5 minutes.`;
  }
}
