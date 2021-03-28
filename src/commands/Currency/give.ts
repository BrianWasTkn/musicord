import { GuildMember, MessageOptions } from 'discord.js';
import { MessagePlus } from '@lib/extensions/message';
import { UserPlus } from '@lib/extensions/user';
import { Argument } from 'discord-akairo';
import { Command } from '@lib/handlers/command';
import { Embed } from '@lib/utility/embed';

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

  public async exec(
    msg: MessagePlus,
    args: {
      member: GuildMember;
      amount: number | string;
    }
  ): Promise<string | MessageOptions> {
    const { fetch, add, remove } = this.client.db.currency;
    const { member, amount } = args;
    if (!member || !amount)
      return `**Wrong Syntax bro**\n**Usage:** \`lava ${this.id} <amount> <@user>\``;

    const data = await msg.author.fetchDB();
    const r = await msg.fetchDB(member.user.id);
    let give: number;
    if (isNaN(amount as number)) {
      let tAmt = (amount as string).toLowerCase();
      if (tAmt === 'all') give = data.pocket;
      if (tAmt === 'half') give = Math.round(data.pocket / 2);
      else return 'Needs to be a whole number yeah?';
    } else {
      give = amount as number;
    }

    if (amount > data.pocket) return 'Thought you can fool me?';
    else if (r.pocket >= this.client.config.currency.maxSafePocket)
      return `Hah! Having over ${this.client.config.currency.maxSafePocket.toLocaleString()} makes them too rich, no thanks.`;
    else if (give < 1) return 'Nah, no negative coins for you';

    let paid = Math.round(give - give * 0.05);
    let tax = Math.round((give * 0.5) / (give / 10));

    const recib = await (member.user as UserPlus)
      .initDB(r)
      .addPocket(paid)
      .db.save();
    const giver = await msg.author
      .initDB(data)
      .removePocket(give)
      .calcSpace()
      .db.save();

    return `You gave ${
      member.user.username
    } **${paid.toLocaleString()}** coins after a **${tax}%** tax. They now have **${recib.pocket.toLocaleString()}** coins while you have **${giver.pocket.toLocaleString()}** coins.`;
  }
}
