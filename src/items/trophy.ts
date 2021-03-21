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
      info: 'Grants you 10% multi per trophy you own.',
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

    if (odds <= 0.1) {
      const fine = util.randomNumber(data.pocket * 0.75, data.pocket);
      if (fine >= 1 && odds > 0.05) {
        await db.currency.remove(msg.author.id, 'pocket', fine);
        return `**You got fined instead!**\nlemme take away **${fine.toLocaleString()}** coins away from your pocket thank you`;
      } 

      const hahausuck = util.randomNumber(trophies.amount * 0.75, trophies.amount);
      trophies.amount -= hahausuck;
      await data.save()
      return `LOL you broke **${hahausuck} ${this.emoji} ${this.name}**${hahausuck > 1 ? 's' : ''}, ${trophies.amount.toLocaleString()} left :skull:`
    }

    const nice = util.randomNumber(1, 500);
    trophies.amount += nice;
    await data.save();
    return `You've been granted **${nice} ${this.emoji} ${this.name}**${nice > 1 ? 's' : ''}! You now have **${trophies.amount.toLocaleString()} ${this.name}**s.`
  }
}
