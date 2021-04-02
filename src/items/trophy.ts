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
      info: 'Grants you 25% multiplier for 30 minutes and another trophy (if you hit the odds of getting it) to flex against normies!',
      name: 'Trophy',
      cost: 2500000,
    });
  }

  async use(msg: MessagePlus): Promise<string> {
    const { db, util } = this.client;
    const data = await msg.author.fetchDB();
    const tr = data.items.find((i) => i.id === this.id);

    let odds = util.randomNumber(1, 100);
    let hit = odds <= 5;
    let fined: boolean;
    let fail: boolean;

    tr.amount += hit ? 1 : 0;
    tr.expire = Date.now() + (30 * 60 * 1e3);
    tr.multi = 25;

    await msg.author.initDB(data).updateItems().db.save();

    return `**${this.emoji} ${this.name}**\nYou now have a **25%** multiplier for 30 minutes${!hit ? '!' : `AND another ${this.name} god you're so lucky.`}`;
  }
}
