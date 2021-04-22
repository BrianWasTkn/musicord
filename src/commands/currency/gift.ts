import { MessageOptions } from 'discord.js';
import { MemberPlus } from 'lib/extensions/member';
import { Context } from 'lib/extensions/message';
import { Command } from 'lib/handlers/command';
import config from 'config/index' ;
import { Embed } from 'lib/utility/embed';
import { Item } from 'lib/handlers/item';

export default class Currency extends Command {
  constructor() {
    super('gift', {
      aliases: ['gift', 'gi'],
      channel: 'guild',
      description: 'Gift items to others. Sharing is caring, they say.',
      category: 'Currency',
      cooldown: 5e3,
      args: [
        { id: 'amount', type: 'number' },
        { id: 'item', type: 'shopItem' },
        { id: 'member', type: 'member' },
      ],
    });
  }

  async exec(
    ctx: Context<{
      member: MemberPlus;
      amount: number;
      item: Item;
    }>
  ): Promise<string | MessageOptions> {
    const { amount, item, member } = ctx.args;
    if (!amount || !item || !member) {
      return `**Wrong Syntax bro**\n**Usage:** \`lava ${this.aliases[0]} <amount> <item> <@user>\``;
    }

    if (member.user.id === ctx.author.id) {
      return 'Lol imagine gifting that to yourself dummy';
    }

    const { maxInventory: cap } = config.currency;
    const { data } = await ctx.db.fetch();
    const r = (await ctx.db.fetch(member.user.id)).data;
    const dInv = data.items.find((i) => i.id === item.id);
    const rInv = r.items.find((i) => i.id === item.id);

    if (amount < 1)
      return `Bro what the heck, you can't gift negative items smh`;
    if (amount > dInv.amount)
      return `Meh, you only have ${dInv.amount.toLocaleString()} of this item, i guess you're too broke to gift many items then.`;
    if (rInv > cap)
      return `They already have more than ${cap.toLocaleString()} of this item!`;

    dInv.amount -= amount;
    await data.save();
    rInv.amount += amount;
    await r.save();

    return {
      replyTo: ctx.id,
      content: `You gave ${member.user.username} **${amount.toLocaleString()} ${
        item.emoji
      } ${item.name}**${
        amount > 1 ? 's' : ''
      }! They now have **${rInv.amount.toLocaleString()}** ${item.id}${
        rInv.amount > 1 ? 's' : ''
      } while you have **${dInv.amount.toLocaleString()}** ${item.id}${
        dInv.amount > 1 ? 's' : ''
      } left.`,
    };
  }
}
