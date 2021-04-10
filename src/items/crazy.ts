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
      name: "Crazy's Alcohol",
      cost: 350000,
      info: {
        short: 'Grants you a great amount of luck while playing the slot machine!',
        long: 'Gives you a 10% chance of getting jackpot on slots! Only lasts for 10 minutes since you\'re jsut a normie.',
      }
    });
  }

  async use(msg: MessagePlus): Promise<string> {
    const data = await msg.author.fetchDB();
    const craz = data.items.find((i) => i.id === this.id);

    craz.amount--;
    craz.expire = Date.now() + 10 * 60 * 1e3;
    await msg.author.initDB(data).updateItems().db.save();

    return 'You now have a **10%** jackpot chance for 10 minutes!';
  }
}
