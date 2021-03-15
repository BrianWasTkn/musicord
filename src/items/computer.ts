import { Message } from 'discord.js';
import { Item } from '@lib/handlers/item';

export default class PowerUp extends Item {
  constructor() {
    super('computer', {
      category: 'Power-Up',
      sellable: false,
      buyable: true,
      usable: true,
      emoji: ':desktop:',
      info: "Post memes on reddit! Gives you up to 1M coins though has a high chance to break.",
      name: "Prob's Computer",
      cost: 6900000,
    });
  }

  async use(msg: Message): Promise<string> {
    const data = await this.client.db.currency.fetch(msg.author.id);
    const comp = data.items.find((i) => i.id === this.id);
    const { util } = this.client;

    if (Math.random() < 0.1) {
      comp.amount -= 1;
      return `You broke your **${this.emoji} ${this.name}** lmao sucks to be you.`
    }

    const type = util.randomInArray(['reposted', 'nerdy', 'original', 'funny']);
    const rand = util.randomNumber.bind(util);
    const gain = rand(10e3, 1e6);
    const karma = rand(1, 500);
    data.pocket += gain;
    await data.save();

    return `You got **__${gain.toLocaleString()}__** (${karma} karmas) from posting a ${type} meme on reddit.`
  }
}
