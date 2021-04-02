import { MessagePlus } from '@lib/extensions/message';
import { Item } from '@lib/handlers/item';

export default class PowerUp extends Item {
  constructor() {
    super('crazy', {
      category: 'Power-Up',
      sellable: true,
      buyable: true,
      usable: true,
      emoji: ':beers:',
      info: 'Gives a 10% chance of getting jackpot on slots for 5 minutes!',
      name: "Crazy's Alcohol",
      cost: 250000,
    });
  }

  async use(msg: MessagePlus): Promise<string> {
    const data = await msg.author.fetchDB();
    const craz = data.items.find((i) => i.id === this.id);

    craz.amount--;
    craz.expire = Date.now() + 5 * 60 * 1e3;
    await msg.author.initDB(data).updateItems().db.save();

    return 'You now have a **10%** jackpot chance for 5 minutes!';
  }
}
