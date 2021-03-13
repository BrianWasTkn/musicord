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
      name: 'Thicco\'s Thiccness',
      info: 'Gives you +50% winnings on gambling. Runs out after 60 seconds. Also what the fuck are you looking at?',
      cost: 1500000,
    });
  }

  async use(msg: Message): Promise<string> {
    const data = await this.client.db.currency.fetch(msg.author.id);
		const thicc = data.items.find(i => i.id === this.id);

    thicc.active = true;
		thicc.expire = Date.now() + (60 * 1000); // client.setTimeout just breaks this
    await data.save();

		return 'You\'ve been granted a great amount of luck from a drinking jenni\'s pees!';
  }
}
