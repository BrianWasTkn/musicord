import { Context, MemberPlus } from 'lib/extensions';
import { MessageOptions } from 'discord.js';
import { Command } from 'lib/objects';

export default class Fun extends Command {
  constructor() {
    super('marry', {
      aliases: ['marry'],
      channel: 'guild',
      description: 'Marry someone!',
      category: 'Fun',
      args: [
        {
          id: 'someone',
          type: 'member',
        },
      ],
    });
  }

  async exec(ctx: Context<{ someone: MemberPlus }>): Promise<MessageOptions> {
    const Ring = ctx.client.handlers.item.modules.get('donut');
    const { data: me } = await ctx.db.fetch();
    const { someone } = ctx.args;

    if (!someone) {
      if (!me.marriage.id) {
        return {
          replyTo: ctx.id,
          content: "You're not married to anyone right now.",
        };
      }

      const some1 = await ctx.client.users.fetch(me.marriage.id, true, true);
      const since = new Date(me.marriage.since);

      return {
        embed: {
          author: {
            name: `${ctx.author.username}'s marriage`,
            icon_url: ctx.author.avatarURL({ dynamic: true }),
          },
          color: 'PINK',
          description: `**Married to:** ${some1.toString()}\n**Since:** ${since.toDateString()}\n**Ring:** ${
            Ring.emoji
          } ${Ring.name}`,
          thumbnail: {
            url: some1.avatarURL({ dynamic: true }),
          },
        },
      };
    }

    const s = (await ctx.db.fetch(someone.user.id, false)).data;
    const inv = Ring.findInv(me.items, Ring);
    const inv2 = Ring.findInv(s.items, Ring);

    if (inv.amount < 1 || inv2.amount < 1) {
      return {
        replyTo: ctx.id,
        content: `Both of you must have at least **1 ${Ring.emoji} ${Ring.name}** in your inventories!`,
      };
    }
    if (s.marriage.id) {
      const marriedTo = (await ctx.guild.members.fetch({ 
        user: me.marriage.id, force: true, cache: true, 
      })) as MemberPlus;

      return {
        replyTo: ctx.id,
        content: `Sad to say but they're already married to **${marriedTo.user.tag}** bro :(`,
      };
    }
    if (someone.user.bot) {
      return { replyTo: ctx.id, content: 'Imagine marrying bots' };
    }
    if (ctx.author.id === someone.user.id) {
      return {
        replyTo: ctx.id,
        content: "Lol imagine marrying yourself, couldn't be me honestly.",
      };
    }

    await ctx.channel.send(
      `${someone.toString()} do you accept this marriage? Type \`(y / n)\` in 30 seconds.`
    );
    const ido = (
      await ctx.channel.awaitMessages((m) => m.author.id === someone.user.id, {
        max: 1,
        time: 3e4,
      })
    ).first();

    if (!ido || !['y'].includes(ido.content.toLowerCase().slice(0, 1))) {
      return { content: 'I guess not then.' };
    }

    inv.amount--;
    me.marriage.id = someone.user.id;
    me.marriage.since = Date.now();
    await me.save();

    inv2.amount--;
    s.marriage.id = ctx.author.id;
    s.marriage.since = Date.now();
    // TODO: make context.db method for marry
    // userEntry.updateQuest({ cmd: this, count: 1 }); 
    await s.save();
    return { replyTo: ctx.id, content: 
      `You're now married to ${someone.user.toString()} GGs! Type \`lava ${
        this.aliases[0]
      }\` to see your marriage profile!`,
    };
  }
}
