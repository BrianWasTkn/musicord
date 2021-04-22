import { MessageOptions } from 'discord.js';
import { MemberPlus } from 'lib/extensions/member';
import { Context } from 'lib/extensions/message';
import { Command } from 'lib/handlers/command';

export default class Currency extends Command {
  constructor() {
    super('active', {
      aliases: ['active', 'ac'],
      channel: 'guild',
      description: "View yours or someone else's active items.",
      category: 'Currency',
      cooldown: 1e3,
      args: [
        {
          id: 'member',
          type: 'member',
          default: (m: Context) => m.member,
        },
      ],
    });
  }

  public async exec(
    ctx: Context<{ member: MemberPlus }>
  ): Promise<string | MessageOptions> {
    const {
      handlers: { item },
      util: { parseTime },
    } = this.client;
    const { data } = await ctx.db.fetch(ctx.args.member.user.id);
    const stamp = ctx.createdTimestamp;
    const actives = data.items
      .filter((i) => i.expire > stamp)
      .map((i) => {
        const it = item.modules.get(i.id);
        const expire = parseTime(Math.floor((i.expire - stamp) / 1e3));

        return `**${it.emoji} ${it.name}** — expires in ${expire}`;
      });

    if (actives.length < 1) {
      return { replyTo: ctx, content: "You don't have active items!" };
    }

    return {
      embed: {
        title: `${ctx.args.member.user.username}'s active items`,
        description: actives.join('\n'),
        color: 'RANDOM',
      },
    };
  }
}
