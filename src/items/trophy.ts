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
      info: 'Grants you 2.5% multi per trophy you own.',
      name: 'Trophy',
      cost: 25000000,
    });
  }

  async use(msg: Message): Promise<string> {
    const { db, util } = this.client;
    const data = await db.currency.fetch(msg.author.id);
    const trophies = data.items.find((i) => i.id === this.id);

    let odds = Math.random();
    let fined: boolean;
    let fail: boolean;
    let fine: number;

    if (odds <= 0.6) {
      if (odds <= 0.3) {
        const hahausuck = util.randomNumber(trophies.amount / 2, trophies.amount);
        trophies.amount -= hahausuck;
        await data.save()
        return `LOL you broke **${hahausuck} ${this.emoji} ${this.name}**${hahausuck > 1 ? 's' : ''} :skull:`
      }

      const fine = util.randomNumber(1, data.pocket / 3);
      await db.currency.remove(msg.author.id, 'pocket', fine < 1 ? 0 : fine);
      return `**You got fined instead!**\nlemme take away **${
        fine.toLocaleString()
      }** coins away from your pocket thank you`;
    }

    const nice = util.randomNumber(1, 10);
    trophies.amount += nice;
    await data.save();
    return `You've been granted **${nice} ${this.emoji} ${this.name}**${nice > 1 ? 's' : ''}! You now have ${trophies.amount} trophies.`
  }
}
