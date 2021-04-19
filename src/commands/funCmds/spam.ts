import { Context } from '@lib/extensions/message';
import { Command } from '@lib/handlers/command';
import {
  PermissionOverwriteOption,
  MessageCollectorOptions,
  CollectorFilter,
  MessageReaction,
  MessageOptions,
  TextChannel,
  GuildMember,
  Collection,
} from 'discord.js';

export default class Fun extends Command {
  constructor() {
    super('jEvent', {
      aliases: ['event', 'je'],
      channel: 'guild',
      description: "Start an join event like 'le old days.",
      category: 'Fun',
      userPermissions: ['MANAGE_MESSAGES'],
      args: [
        {
          id: 'amount',
          type: 'number',
          default: 1000000,
        },
        {
          id: 'lock',
          type: 'boolean',
          default: true,
        },
        {
          id: 'hits',
          type: 'number',
          default: 50,
        },
      ],
    });
  }

  private get strings(): string[] {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456'.split('');
  }

  async exec(ctx: Context<{
    amount: number;
    lock: boolean;
    hits: number;
  }>): Promise<MessageOptions> {
    await ctx.delete().catch(() => {});
    const { amount, lock, hits } = ctx.args;
    const { util } = this.client;
    const { events } = util;
    const { guild } = ctx;
    const channel = ctx.channel as TextChannel;
    const lockChan = this.lockChan.bind(ctx);

    if (events.has(guild.id)) return;
    else events.set(guild.id, channel.id);
    if (lock) await lockChan(true);

    const string = util.randomInArray(this.strings);
    await channel.send(
      `**<:memerGold:753138901169995797> \`SPAM EVENT NICE\`**\n
      **Spam Spam Spam**\nSplit **${amount.toLocaleString()}** under 2 minutes.`
    );
    await channel.send(`Spam \`${string.toUpperCase()}\` **${hits}** times`);
    const entries = new Collection<string, GuildMember>();

    const options: MessageCollectorOptions = { max: hits, time: 120000 };
    const filter: CollectorFilter<[Context]> = ({ content }) =>
      content.toLowerCase() === (string as string).toLowerCase();
    const collector = channel.createMessageCollector(filter, options);

    collector
      .on('collect', async (m: Context) => {
        if (!entries.has(m.author.id)) {
          entries.set(m.author.id, m.member);
          return await m.react('<:memerGold:753138901169995797>');
        }
      })
      .on('end', async (col: Collection<string, Context>) => {
        let success: GuildMember[] = [];
        events.delete(guild.id);
        if (lock) await lockChan(false);

        if (col.size <= 1) {
          return ctx.reply('**:skull: RIP! No one joined.**');
        }

        await channel.send(
          `**${entries.size} people** landed **${
            col.size
          }** hits altogether and are teaming up to split __${amount.toLocaleString()}__ coins...`
        );

        entries
          .array()
          .sort(() => Math.random() - 0.5)
          .forEach((c) => {
            const ok = Math.random() > 0.5 && success.length <= 15;
            return ok ? success.push(c) : {};
          });

        const coins = Math.round(amount / success.length);
        const order =
          success.length >= 1
            ? success.map((s) => {
                const name = s.nickname === null ? s.user.username : s.nickname;
                return `+ ${name} got ${coins.toLocaleString()}`;
              })
            : ['- Everybody died LOL'];

        const split = (coins > 1 ? coins : 1).toLocaleString();
        await channel.send(
          `**Good job everybody, we split up \`${split}\` each!**`
        );
        return ctx.send({
          code: 'diff',
          content: order.join('\n'),
        });
      });
  }

  private lockChan(this: Context, bool: boolean): Promise<TextChannel> {
    const change: PermissionOverwriteOption = { SEND_MESSAGES: bool };
    const reason = `Spam Event — ${this.author.tag}}`;
    const channel = this.channel as TextChannel;
    return channel.updateOverwrite(this.guild.id, change, reason);
  }
}
