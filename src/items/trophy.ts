import { CurrencyProfile } from '@lib/interface/mongo/currency';
import { Document } from 'mongoose';
import { MessagePlus } from '@lib/extensions/message';
import { Item } from '@lib/handlers/item';

export default class Collectible extends Item {
  constructor() {
    super('trophy', {
      category: 'Flex',
      sellable: false,
      buyable: true,
      usable: true,
      emoji: '🏆',
      info: 'Grants you 1% multi per trophy you own.',
      name: 'Trophy',
      cost: 2500000,
    });
  }

  async use(msg: MessagePlus): Promise<string> {
    const { db, util } = this.client;
    const data = await msg.author.fetchDB();
    const trophies = data.items.find((i) => i.id === this.id);

    let odds = Math.random();
    let fined: boolean;
    let fail: boolean;

    if (odds <= 0.1) {
      const fine = util.randomNumber(data.pocket * 0.5, data.pocket);
      if (fine >= 1 && odds > 0.05) {
        await msg.author.dbRemove('pocket', fine);
        return `**You got fined instead!**\nlemme take away **${fine.toLocaleString()}** coins away from your pocket thank you`;
      } 

      const hahausuck = util.randomNumber(trophies.amount * 0.5, trophies.amount);
      trophies.amount -= hahausuck;
      await msg.author.initDB(data).updateItems().db.save();
      
      return `LOL you broke **${hahausuck} ${this.emoji} ${this.name}**${hahausuck > 1 ? 's' : ''}, ${trophies.amount.toLocaleString()} left :skull:`
    }

    const nice = util.randomNumber(1, 10);
    trophies.amount += nice;
    await msg.author.initDB(data).updateItems().db.save();
    
    return `You've been granted **${nice} ${this.emoji} ${this.name}**${nice > 1 ? 's' : ''}! You now have **${trophies.amount.toLocaleString()} ${this.name}**s.`
  }
}
