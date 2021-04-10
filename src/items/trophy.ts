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
      info: 'Grants you 50% multiplier for 5 minutes and a random amount of trophies (if you hit the odds of getting it) to flex against normies!',
      name: 'Trophy',
      cost: 3000000,
    });
  }

  async use(msg: MessagePlus): Promise<string> {
    const { util } = this.client;
    const data = await msg.author.fetchDB();
    const tr = data.items.find((i) => i.id === this.id);

    let odds = util.randomNumber(1, 100);
    let nice = util.randomNumber(1, 5);
    let hit = odds <= 10;

    tr.amount += hit ? nice : 0;
    tr.expire = Date.now() + (30 * 60 * 1e3);
    tr.multi = 50;

    await msg.author.initDB(data).updateItems().db.save();
    return `**${this.emoji} ${this.name}**\nYou now have a **25%** multiplier for 30 minutes${!hit ? '!' : ` AND **${nice.toLocaleString()} ${this.name}**${nice > 1 ? 's' : ''} god you're so lucky.`}`;
  }
}
