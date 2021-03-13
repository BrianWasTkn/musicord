import { CurrencyProfile } from '@lib/interface/mongo/currency';
import { Document } from 'mongoose';
import { Message } from 'discord.js';
import { Item } from '@lib/handlers/item';

export default class Collectible extends Item {
  constructor() {
    super('trophy', {
      category: 'Flex',
      sellable: false,
      buyable: true,
      usable: true,
      emoji: '🏆',
      name: 'Trophy',
      info: 'Grants you another trophy if you use it, or not.',
      cost: 2500000,
    });
  }

  async use(msg: Message): Promise<string> {
    const { db, util } = this.client;
    const data = await db.currency.fetch(msg.author.id);
    const trophies = data.items.find((i) => i.id === this.id);
    const hahausuck = util.randomNumber(1, trophies.amount);
    let fail: boolean;

    if (Math.random() > 0.6) {
      trophies.amount++;
      fail = false;
    } else {
      fail = true;
      trophies.amount -= hahausuck;
    }

    await data.save();
    const inv = data.items.find((i) => i.id === this.id);
    return fail
      ? `LOL You broke **${hahausuck.toLocaleString()}** trophies sucks to be you then I guess`
      : `You have been granted **1** trophy! You now have a total of **${trophies.amount.toLocaleString()}** trophies.`;
  }
}
