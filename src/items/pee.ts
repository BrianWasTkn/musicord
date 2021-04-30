import { Context } from 'lib/extensions/message';
import { MessageOptions } from 'discord.js';
import { UserPlus } from 'lib/extensions/user';
import { Item } from 'lib/handlers/item';

export default class Flex extends Item {
  constructor() {
    super('pee', {
      category: 'Flex',
      sellable: true,
      buyable: true,
      usable: true,
      emoji: ':baby_bottle:',
      name: "Jenni's Piss",
      cost: 1000,
      tier: 1,
      info: {
        short: 'Use it to surprise somebody!',
        long:
          "Send a bag of jenni's yellow substance to stinkingly surprise someone!",
      },
    });
  }

  async use(ctx: Context): Promise<MessageOptions> {
    const { data } = await ctx.db.fetch();
    const piss = this.findInv(data.items, this);

    ctx.send({ content: `You have **${piss.amount.toLocaleString()} ${this.emoji} ${this.name}** to surprise, how many do you wanna use?` });
    const rep = (await ctx.awaitMessage(ctx.author.id, 15e3)).first();
    if (!rep.content || !Number.isInteger(Number(rep.content)) || Number(rep.content) < 1) {
      return { replyTo: ctx.id, content: "Needs to be a real number greater than 0 yeah?" };
    }

    let choice = Number(rep.content);
    if (choice > piss.amount) {
      return { replyTo: ctx.id, content: 'Lol imagine having way less than what you actually wanted to give' };
    }

    await ctx.send({ content: 'who would you surprise?' });
    const rep2 = (await ctx.awaitMessage(ctx.author.id, 15e3)).first();
    const meb = this.client.util.resolveMember(rep2.content, ctx.guild.members.cache, false);
    if (!meb) {
      return { replyTo: ctx.id, content: "Bro imagine not surprising anyone, that's so sad :(" };
    }

    const mebData = (await ctx.db.fetch(meb.user.id, false)).data;
    const mebInv = mebData.items.find((piss) => piss.id === this.id);

    mebInv.amount += choice;
    piss.amount -= choice;
    await data.save();
    await mebData.save();

    return { replyTo: ctx.id, content: `Alright, ${meb.user.username} got your stinking surprise :kiss:` };
  }
}
