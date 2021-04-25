import { Context } from 'lib/extensions/message';
import { MessageOptions } from 'discord.js';
import { Item } from 'lib/handlers/item';
import config from 'config/index' ;

export default class PowerUp extends Item {
  constructor() {
    super('porsche', {
      category: 'Power-Up',
      sellable: true,
      buyable: true,
      usable: true,
      emoji: ':credit_card:',
      name: "Porsche's Card",
      cost: 600000,
      info: {
        short: 'Expand your vault capacity for more coin space.',
        long:
          "Increases your vault capacity from 10K up to 50K coins or sell it for coins, it's your choice really.",
      },
    });
  }

  async use(ctx: Context): Promise<MessageOptions> {
    const { util } = this.client;
    const card = this.findInv(ctx.db.data.items, this);

    if (ctx.db.data.space >= config.currency.maxSafeSpace) {
      return { content: 'You already have max vault space bruh' };
    }

    const m = `${ctx.author.toString()} You have ${card.amount.toLocaleString()} cards. How many cards do you wanna reveal right now?`;
    await ctx.send({ content: m });
    const f = (m: Context) => m.author.id === ctx.author.id;
    const rep = (await ctx.awaitMessage(ctx.author.id, 15e3)).first();

    if (!rep) return { content: 'lol bye, thanks for nothing.' };
    let choice = Number(rep.content);
    if (!Boolean(Number(rep.content)) || Number(rep.content) < 1) {
      return { content: 'Needs to be a real number more than 0 bruh' };
    }
    if (choice > card.amount) {
      return { content: `Don't try and break me bish, you only have **${card.amount.toLocaleString()}** of these.` };
    }

    let gain: number[] | number;
    gain = Array(choice).fill(null).map(() => util.randomNumber(1e4, 5e4)).reduce((p, c) => p + c);
    
    const data = await ctx.db.expandSpace(gain).removeInv(this.id, choice).updateItems().save();
    return { content: `**You crafted __${
      choice.toLocaleString()
    }__ cards into your vault.**\nThis brings you to **${
      data.space.toLocaleString()
    }** of total vault capacity, with **${
      gain.toLocaleString()
    } (${Math.round(
      gain / choice
    ).toLocaleString()} average) ** being revealed.` };
  }
}
