import { MessagePlus } from '@lib/extensions/message';
import { Item } from '@lib/handlers/item';

export default class PowerUp extends Item {
  constructor() {
    super('coffee', {
      category: 'Power-Up',
      sellable: true,
      buyable: true,
      usable: true,
      emoji: ':hot_face:',
      info: 'Gives up to 50% multiplier for 10 minutes.',
      name: "Badddie's Coffee",
      cost: 350000,
    });
  }

  async use(msg: MessagePlus): Promise<string> {
    const { randomNumber, sleep } = this.client.util;
    const data = await msg.author.fetchDB();
    const cof = data.items.find((i) => i.id === this.id);
    const multi = randomNumber(5, 50);

    await msg.channel.send('Making your coffee...');
    cof.expire = Date.now() + (10 * 60 * 1e3);
    cof.multi = multi;
    cof.amount--;

    await msg.author.initDB(data).updateItems().db.save();

    return `Your coffee got cold giving you a **${multi}%** multiplier valid for 10 minutes!`;
  }
}
