import { GuildMember, MessageOptions } from 'discord.js';
import { Context } from 'lib/extensions';
import { Command } from 'lib/objects';
import { Embed } from 'lib/utility/embed';

export default class Currency extends Command {
  constructor() {
    super('postmeme', {
      aliases: ['postmeme', 'pm'],
      channel: 'guild',
      description: 'Post a meme on reddit.',
      category: 'Currency',
      cooldown: 45e3,
    });
  }

  async exec(ctx: Context) {
    const comp = ctx.client.handlers.item.modules.get('computer');
    const { data } = await ctx.db.fetch();
    const inv = comp.findInv(data.items, comp);

    if (inv.amount < 1) {
      return { replyTo: ctx.id, content: `LOL buy at least **1 ${comp.emoji} ${comp.name}** to post memes.` };
    }

    return await comp.use(ctx);
  }
}
