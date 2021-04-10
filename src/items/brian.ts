import { MessagePlus } from '@lib/extensions/message';
import { Item } from '@lib/handlers/item';

export default class Powerflex extends Item {
  constructor() {
    super('brian', {
      category: 'Powerflex',
      sellable: true,
      buyable: true,
      usable: true,
      emoji: ':brown_heart:',
      info: 'Gives up to 50% multiplier and a 5% jackpot chance in slots for 10 minutes.',
      name: "Brian's Heart",
      cost: 225000,
    });
  }

  async use(msg: MessagePlus) {
    const { randomNumber, sleep } = this.client.util;
    const data = await msg.author.fetchDB();
    const heart = data.items.find((i) => i.id === this.id);

    await msg.channel.send(`Beating your heart...`);
    const multi = randomNumber(5, 50);

    heart.expire = Date.now() + 10 * 60 * 1e3;
    heart.multi = multi;
    heart.amount--;

    await msg.author.initDB(data).updateItems().db.save();
    return `You now have a **${multi}% multiplier** and **5% jackpot chance** under 10 minutes!`;
  }
}
