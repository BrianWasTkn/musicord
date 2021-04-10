import { MessagePlus } from '@lib/extensions/message';
import { Item } from '@lib/handlers/item';

export default class PowerUp extends Item {
  constructor() {
    super('thicc', {
      category: 'Power-Up',
      sellable: true,
      buyable: true,
      usable: true,
      emoji: ':joy:',
      info: 'Gives you +50% winnings on gambling for 10 minutes.',
      name: "Thicco's Thiccness",
      cost: 3000000,
    });
  }

  async use(msg: MessagePlus): Promise<string> {
    const data = await msg.author.fetchDB();
    const thicc = data.items.find((i) => i.id === this.id);

    thicc.expire = Date.now() + 10 * 60 * 1000; // client.setTimeout just breaks this
    thicc.amount--;

    await msg.author.initDB(data).updateItems().db.save();
    return 'You have been granted an additional **50%** winnings in gambling for a lucky 10 minutes!';
  }
}
