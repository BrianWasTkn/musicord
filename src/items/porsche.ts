import { Context } from 'lib/extensions/message';
import config from 'config/index' ;
import { Item } from 'lib/handlers/item';

export default class PowerUp extends Item {
  constructor() {
    super('porsche', {
      category: 'Power-Up',
      sellable: true,
      buyable: true,
      usable: true,
      emoji: ':credit_card:',
      name: "Porsche's Card",
      cost: 1250000,
      info: {
        short: 'Expand your vault capacity for more coin space.',
        long:
          "Increases your vault capacity from 20K up to 50K coins or sell it for coins, it's your choice really.",
      },
    });
  }

  async use(ctx: Context): Promise<string> {
    const { data } = await ctx.db.fetch();
    const { util } = this.client;
    const card = this.findInv(data.items, this);

    if (data.space >= config.currency.maxSafeSpace) {
      return 'You already have max vault space bruh';
    }

    const m = `${ctx.author.toString()} You have ${card.amount.toLocaleString()} cards. How many cards do you wanna reveal right now?`;
    await ctx.send({ content: m });
    const f = (m: Context) => m.author.id === ctx.author.id;
    const rep = (
      await ctx.channel.awaitMessages(f, { max: 1, time: 15000 })
    ).first();

    if (!rep) return 'lol bye, thanks for nothing.';
    let choice = Number(rep.content);
    if (!Boolean(Number(rep.content))) return 'Needs to be a number bruh';
    if (choice > card.amount)
      return `Don't try and break me bish, you only have ${card.amount.toLocaleString()} of these.`;

    let gain: number[] | number;
    gain = Array(choice)
      .fill(null)
      .map(() => util.randomNumber(2e4, 5e4))
      .reduce((p, c) => p + c);
    card.amount -= choice;
    data.space += gain;
    await data.save();

    return `**You crafted __${choice.toLocaleString()}__ cards into your vault.**\nThis brings you to **${data.space.toLocaleString()}** of total vault capacity, with **${gain.toLocaleString()} (${Math.round(
      gain / choice
    ).toLocaleString()} average) ** being revealed.`;
  }
}
