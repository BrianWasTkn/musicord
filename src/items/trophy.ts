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
      info: 'Grants you 5% multi per trophy and another trophy if you use it.',
      name: 'Trophy',
      cost: 25000000,
    });
  }

  async use(msg: Message): Promise<string> {
    const { db, util } = this.client;
    const data = await db.currency.fetch(msg.author.id);
    const trophies = data.items.find((i) => i.id === this.id);

    let fined: boolean;
    let fail: boolean;
    let fine: number;

    if (Math.random() <= 0.4) {
      if (Math.random() <= 0.2) {
        const hahausuck = util.randomNumber(1, 10);
        trophies.amount -= hahausuck;
        return `LOL you broke **${hahausuck}** trophies :skull:`
      }

      const fine = util.randomNumber(1, data.pocket / 3);
      await db.currency.remove(msg.author.id, 'pocket', fine);
      return `You got fined instead, lemme take away **${
        fine.toLocaleString()
      }** coins away from your pocket thank you`;
    }

    const nice = util.randomNumber(1, 10);
    trophies.amount++;
    await data.save();
    return `You've been granted **${nice} ${this.emoji} ${this.name}**${nice > 1 ? 's' : ''}! You now have ${trophies.amount} trophies.`
  }
}
