import { GuildMember, MessageOptions } from 'discord.js';
import { Context } from 'lib/extensions/message';
import { Command } from 'lib/handlers/command';
import { Embed } from 'lib/utility/embed';

export default class Currency extends Command {
  constructor() {
    super('postmeme', {
      aliases: ['postmeme', 'pm'],
      channel: 'guild',
      description: 'Post a meme on reddit.',
      category: 'Currency',
      cooldown: 45e3,
      examples: () => this.aliases[0],
    });
  }

  async exec(ctx: Context) {
    const comp = this.client.handlers.item.modules.get('computer');
    const { data } = await ctx.db.fetch();
    const inv = comp.findInv(data.items, comp);

    if (inv.amount < 1) {
      return { replyTo: ctx.id, content: `LOL buy at least **1 ${comp.emoji} ${comp.name}** to post memes.` };
    }

    const ret = (await comp.use(ctx)) as string;
    return ret;
  }
}
