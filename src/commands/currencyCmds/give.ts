import { MessageOptions } from 'discord.js';
import { MemberPlus } from '@lib/extensions/member';
import { Context } from '@lib/extensions/message';
import { UserPlus } from '@lib/extensions/user';
import { Argument } from 'discord-akairo';
import { Command } from '@lib/handlers/command';

export default class Currency extends Command {
  constructor() {
    super('give', {
      aliases: ['give', 'share'],
      channel: 'guild',
      description: 'Give coins to others with a flat tax rate of 5%.',
      category: 'Currency',
      cooldown: 10000,
      args: [
        {
          id: 'amount',
          type: Argument.union('number', 'string'),
        },
        {
          id: 'member',
          type: 'member',
        },
      ],
    });
  }

  public async exec(ctx: Context<{
    amount: number | string;
    member: MemberPlus;
  }>): Promise<string | MessageOptions> {
    const { member, amount } = ctx.args;
    if (!member || !amount) {
      return `**Wrong Syntax bro**\n**Usage:** \`lava ${this.id} <amount> <@user>\``;
    }

    const authorEntry = await ctx.db.fetch();
    const { data } = authorEntry;
    let give: number;
    if (isNaN(amount as number)) {
      let tAmt = (amount as string).toLowerCase();
      if (tAmt === 'all') {
        give = data.pocket;
      } else if (tAmt === 'half') {
        give = Math.round(data.pocket / 2);
      } else {
        return 'Needs to be a whole number yeah?';
      }
    } else {
      give = amount as number;
    }

    const memberEntry = await ctx.db.fetch(member.user.id);
    const { data: r } = memberEntry;
    if (member.user.id === ctx.author.id) 
      return 'Lol imagine giving yourself coins';
    if (amount > data.pocket) 
      return 'Thought you can fool me?';
    if (r.pocket >= this.client.config.currency.maxSafePocket)
      return `Hah! Having over ${this.client.config.currency.maxSafePocket.toLocaleString()} makes them too rich, no thanks.`;
    if (give < 1) 
      return 'Nah, no negative coins for you';

    let paid = Math.round(give - give * 0.08);
    let tax = Math.round((give * 0.8) / (give / 10));

    const recib = await memberEntry
      .addPocket(paid)
      .updateItems()
      .save();
    const giver = await authorEntry
      .removePocket(give)
      .updateItems()
      .calcSpace()
      .save();

    return `You gave ${
      member.user.username
    } **${paid.toLocaleString()}** coins after a **${
      tax
    }%** tax. They now have **${
      recib.pocket.toLocaleString()
    }** while you have **${
      giver.pocket.toLocaleString()
    }** left.`;
  }
}
