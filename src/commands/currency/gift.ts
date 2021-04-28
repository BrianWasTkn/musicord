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
  ): Promise<MessageOptions> {
    const { amount, item, member } = ctx.args;
    if (!amount || !item || !member) {
      return { replyTo: ctx.id, content: `**Wrong Syntax bro**\n**Usage:** \`lava ${this.aliases[0]} <amount> <item> <@user>\`` };
    }
    if (member.user.id === ctx.author.id) {
      return { replyTo: ctx.id, content: 'Lol imagine gifting that to yourself dummy' };
    }

    const { maxInventory: cap } = config.currency;
    const userEntry = await ctx.db.fetch(ctx.author.id);
    const rEntry = await ctx.db.fetch(member.user.id, false);
    const { data: uData } = userEntry;
    const { data: rData } = rEntry;
    const uInv = item.findInv(uData.items, item);
    const rInv = item.findInv(rData.items, item);

    if (amount < 1) {
      return { replyTo: ctx.id, content: `you can't gift negative items smh` };
    }
    if (amount > uInv.amount) {
      return { replyTo: ctx.id, content: `u only have ${uInv.amount.toLocaleString()} of this item` };
    }
    if (rInv > cap) {
      return { replyTo: ctx.id, content: `they already have more than ${cap.toLocaleString()} of this item!` };
    }

    await userEntry.removeInv(item.id, amount).save();
    await rEntry.addInv(item.id, amount).save();
    ctx.client.handlers.quest.emit('itemShare', { 
      ctx, itemArg: item, amount 
    });

    return {
      replyTo: ctx.id,
      content: `You gave ${member.user.username} **${amount.toLocaleString()} ${
        item.emoji
      } ${item.name}**${
        amount > 1 ? 's' : ''
      }! They now have **${rInv.amount.toLocaleString()}** ${item.id}${
        rInv.amount > 1 ? 's' : ''
      } while you have **${uInv.amount.toLocaleString()}** ${item.id}${
        uInv.amount > 1 ? 's' : ''
      } left.`,
    };
  }
}
