import { Message } from 'discord.js';
import { Item } from '@lib/handlers/item';

export default class PowerUp extends Item {
  constructor() {
    super('coffee', {
      category: 'Power-Up',
      sellable: true,
      buyable: true,
      usable: true,
      emoji: ':hot_face:',
      info: "Gives 5-50% multiplier for 5 minutes.",
      name: "Badddie's Coffee",
      cost: 35000000,
    });
  }

  async use(msg: Message): Promise<string> {
    const { db, util } = this.client;
    const data = await db.currency.fetch(msg.author.id);
    const cof = data.items.find(i => i.id === this.id);
    const multi = util.randomNumber(5, 50);

    cof.amount--;
    cof.multi = multi;
    cof.expire = Date.now() + (5 * 60 * 1e3);
    await data.save();

    return `You have been granted a **${multi}% multiplier** for 5 minutes.`;
  }
}
