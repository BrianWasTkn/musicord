import { MessageOptions } from 'discord.js';
import { MemberPlus } from 'lib/extensions/member';
import { Context } from 'lib/extensions/message';
import { Command } from 'lib/handlers/command';
import config from 'config/index' ;
import { Embed } from 'lib/utility/embed';
import { Item } from 'lib/handlers/item';

export default class Currency extends Command {
  constructor() {
    super('giff', {
      aliases: ['giff'],
      channel: 'guild',
      description: 'Gift items to others. Sharing is caring, they say.',
      category: 'Currency',
      ownerOnly: true,
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

    const { maxInventory: cap } = config.currency;
    const userEntry = await ctx.db.fetch(ctx.author.id);
    const rEntry = await ctx.db.fetch(member.user.id, false);
    const { data: uData } = userEntry;
    const { data: rData } = rEntry;
    const uInv = item.findInv(uData.items, item);
    const rInv = item.findInv(rData.items, item);

    await userEntry.removeInv(item.id, amount).save();
    await rEntry.addInv(item.id, amount).save();
    this.client.handlers.quest.emit('itemShare', { ctx, itemArg: item, amount });
    await ctx.react('✅');
  }
}
