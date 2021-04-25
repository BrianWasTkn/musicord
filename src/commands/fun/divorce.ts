import { MessageOptions } from 'discord.js';
import { Context } from 'lib/extensions/message';
import { UserPlus } from 'lib/extensions/user';
import { Command } from 'lib/handlers/command';

export default class Fun extends Command {
  constructor() {
    super('divorce', {
      aliases: ['divorce'],
      channel: 'guild',
      description: 'Divorce your husband or wife!',
      category: 'Fun',
    });
  }

  async exec(ctx: Context): Promise<MessageOptions> {
    const { data: me } = await ctx.db.fetch();
    if (!me.marriage.id) {
      return {
        replyTo: ctx.id,
        content: "You're not even married to somebody",
      };
    }

    const husOrWif = (await this.client.users.fetch(me.marriage.id)) as UserPlus;
    await ctx.send({ content: `Are you sure you about that? Type \`y\` or \`n\` in 30 seconds.` });
    const resp = (await ctx.awaitMessage(ctx.author.id, 3e4)).first();
    if (!resp || !['yes', 'y'].includes(resp.content.toLowerCase())) {
      return { replyTo: ctx.id, content: 'Well ok then' };
    }

    const { data: div } = await ctx.db.fetch(husOrWif.id, false);
    me.marriage.id = ''; await me.save();
    div.marriage.id = ''; await div.save();

    return {
      replyTo: ctx.id,
      content: `**:white_check_mark: Divorced ${husOrWif.tag} successful.**`,
    };
  }
}
