import { Message } from 'discord.js';
import { Item } from '@lib/handlers/item';

export default class PowerUp extends Item {
  constructor() {
    super('thicc', {
      category: 'Power-Up',
      sellable: false,
      buyable: true,
      usable: false,
      emoji: ':joy:',
      info: 'Gives you +50% winnings on gambling. Runs out after 60 seconds. Also what the fuck are you looking at?',
      name: 'Thicco\'s Thiccness',
      cost: 1500000,
    });
  }

  async use(msg: Message): Promise<string> {
    const data = await this.client.db.currency.fetch(msg.author.id);
		const thicc = data.items.find(i => i.id === this.id);

    thicc.amount--;
    thicc.active = true;
		thicc.expire = Date.now() + (60 * 1000); // client.setTimeout just breaks this
    await data.save();

		return 'You have been granted an additional **50%** to your gamble winnings for **60 seconds** only.';
  }
}
