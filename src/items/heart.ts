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
      info:
        'Gives 50% multi, +25% winnings in gamble, +5% jackpot chance in slots ALL in 5 minutes.',
      name: "Brian's Heart",
      cost: 125000,
    });
  }

  async use(msg: MessagePlus): Promise<string> {
    const data = await msg.author.fetchDB();
    const heart = data.items.find((i) => i.id === this.id);
    const multi = 50;

    heart.amount--;
    heart.expire = Date.now() + 5 * 60 * 1e3;
    heart.multi = 50;
    await msg.author.initDB(data).updateItems().db.save();

    return `You have been granted a **${multi}% multiplier, +25% winnings in gamble and +5% chance of jackpots in slots** for 5 minutes.`;
  }
}
