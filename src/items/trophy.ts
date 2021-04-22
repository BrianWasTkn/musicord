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
      cost: 3000000,
      checks: ['time'],
      info: {
        short: 'Flex it against normies.',
        long:
          'Grants you 50% multiplier for 5 minutes and a random amount of trophies (if you hit the odds of getting it) to flex against normies!',
      },
    });
  }

  async use(ctx: Context): Promise<string> {
    const { data } = await ctx.db.fetch();
    const { util } = this.client;
    const tr = this.findInv(data.items, this);

    let odds = util.randomNumber(1, 100);
    let nice = util.randomNumber(1, 5);
    let hit = odds <= 10;

    tr.amount += hit ? nice : 0;
    tr.expire = Date.now() + 30 * 60 * 1e3;
    tr.multi = 50;

    await ctx.db.updateItems().save();
    return `**${this.emoji} ${
      this.name
    }**\nYou now have a **25%** multiplier for 30 minutes${
      !hit
        ? '!'
        : ` AND **${nice.toLocaleString()} ${this.name}**${
            nice > 1 ? 's' : ''
          } god you're so lucky.`
    }`;
  }
}
