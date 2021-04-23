import { MessageOptions } from 'discord.js';
import { Context } from 'lib/extensions/message';
import { Item } from 'lib/handlers/item';

export default class Collectible extends Item {
  constructor() {
    super('trophy', {
      category: 'Flex',
      sellable: false,
      buyable: true,
      usable: true,
      emoji: '🏆',
      name: 'Trophy',
      cost: 50000000,
      checks: ['activeState'],
      info: {
        short: 'A very powerful item to flex against normies.',
        long:
          'Grants you 1% multiplier for every trophy you own, another trophy and powers all kinds of gambling games by adding 100% of your winnings for 12 hours to flex against normies!',
      },
    });
  }

  async use(ctx: Context): Promise<MessageOptions> {
    const entry = await ctx.db.fetch(),
    { randomNumber } = this.client.util,
    { data } = entry;

    const tr = this.findInv(data.items, this);
    const odds = randomNumber(1, 100);

    if (odds >= 5) {
      const nice = randomNumber(1, 100);
      const won = randomNumber(1, 100) * 1e3;
      await entry.addInv(this.id, nice).addPocket(won).save();
      return { content: `You got **${nice} ${this.name}** and **${won.toLocaleString()}** coins!` };
    }

    const hahayes = randomNumber(tr.amount / 2, tr.amount);
    await entry.removeInv(this.id, hahayes).save();

    return { embed: {
      description: `You lost **${hahayes} ${this.name}** lmao`,
      title: `You failed!`,
      color: 'RED',
    }};
  }
}
