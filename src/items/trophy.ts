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
      info: 'Grants you 15% multi per trophy and another trophy if you use it.',
      name: 'Trophy',
      cost: 20000000,
    });
  }

  async use(msg: Message): Promise<string> {
    const { db, util } = this.client;
    const data = await db.currency.fetch(msg.author.id);
    const trophies = data.items.find((i) => i.id === this.id);

    const hahausuck = util.randomNumber(1, Math.floor(trophies.amount / 2));
    let fail: boolean;

    if (Math.random() >= 0.1) {
      trophies.amount++;
      fail = false;
    } else {
      fail = true;
      trophies.amount -= hahausuck;
    }

    await data.save();
    const inv = data.items.find((i) => i.id === this.id);
    return fail
      ? `**LOL you broke __${hahausuck.toLocaleString()}__ trophies sucks to be you**`
      : `You have been granted **1** trophy! You now have a total of **${trophies.amount.toLocaleString()}** trophies.`;
  }
}
