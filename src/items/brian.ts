import { Context } from 'lib/extensions/message';
import { Item } from 'lib/handlers/item';

export default class Powerflex extends Item {
  constructor() {
    super('brian', {
      category: 'Power-Flex',
      sellable: true,
      buyable: true,
      usable: true,
      emoji: ':brown_heart:',
      name: "Brian's Heart",
      cost: 225000,
      info: {
        short: 'Grants you a great amount of luck on gamble and slots!',
        long:
          'Gives up to 50% multiplier and a 5% jackpot chance in slots for 10 minutes.',
      },
    });
  }

  async use(ctx: Context) {
    const { randomNumber, sleep } = this.client.util;
    const { data } = await ctx.db.fetch();
    const heart = data.items.find((i) => i.id === this.id);

    const multi = randomNumber(5, 50);
    heart.expire = Date.now() + 10 * 60 * 1e3;
    heart.multi = multi;
    heart.amount--;

    await ctx.db.updateItems().save();
    return `You now have a **${multi}% multiplier** and **5% jackpot chance** under 10 minutes!`;
  }
}
