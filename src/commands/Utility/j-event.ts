import {
  PermissionOverwriteOption,
  MessageCollectorOptions,
  CollectorFilter,
  MessageReaction,
  MessageOptions,
  TextChannel,
  GuildMember,
  Collection,
  Message,
} from 'discord.js';
import { Command } from '@lib/handlers/command';

export default class Utility extends Command {
  constructor() {
    super('jEvent', {
      aliases: ['event', 'je'],
      channel: 'guild',
      description: "Start an join event like 'le old days.",
      category: 'Utility',
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

  private get strings(): (((m?: Message) => string) | string)[] {
    return [
      (m: Message) => m.guild.name,
      (m: Message) => m.client.user.username,
      'NICE SPAM',
      'NICE LOGO',
      'NICE',
      'MEOW',
      'OKURR',
      'Z',
      'LOL',
      'PROBBER',
      'TAKEN',
      'CHIPS',
      'DRIP',
      'SWAG',
      'HELICOPTER',
    ];
  }

  private handleCollect(
    this: Message,
    entries: Collection<string, GuildMember>
  ): Promise<MessageReaction> | Collection<string, GuildMember> {
    return !entries.has(this.author.id)
      ? this.react('<:memerGold:753138901169995797>')
      : entries.set(this.author.id, this.member);
  }

  async exec(
    _: Message,
    args: {
      amount: number;
      lock: boolean;
      hits: number;
    }
  ): Promise<MessageOptions> {
    await _.delete().catch(() => {});
    const { amount, lock, hits } = args;
    const { util } = this.client;
    const { events } = util;
    const { guild } = _;
    const channel = _.channel as TextChannel;
    const lockChan = this.lockChan.bind(_);

    if (events.has(guild.id)) return;
    else events.set(guild.id, channel.id);
    if (lock) await lockChan(true);

    let string = util.randomInArray(this.strings);
    string =
      typeof string === 'function'
        ? util.isPromise(string)
          ? await string(_)
          : string(_)
        : string;
    await channel.send(
      `**<:memerGold:753138901169995797> \`JEVENT NICE\`**\n
      **Spam Spam Spam**\nSplit **${amount.toLocaleString()}**, now.`
    );
    await channel.send(`Spam \`${string.toUpperCase()}\` **${hits}** times`);
    const entries: Collection<string, GuildMember> = new Collection();
    const options: MessageCollectorOptions = { max: hits, time: 120000 };
    const filter: CollectorFilter = (m: Message) =>
      m.content.toLowerCase() === (string as string).toLowerCase();

    const collector = channel.createMessageCollector(filter, options);
    collector.on('collect', (m: Message) =>
      this.handleCollect.call(m, entries)
    );
    collector.on('end', async (col: Collection<string, Message>) => {
      let success: GuildMember[] = [];
      events.delete(guild.id);

      if (lock) await lockChan(false);
      if (col.size <= 1) return _.reply('**:skull: RIP! No one joined.**');

      await channel.send(
        `**${entries.size} people** landed **${
          col.size
        }** hits altogether and are teaming up to split __${amount.toLocaleString()}__ coins...`
      );
      await util.sleep(util.randomNumber(5, 10) * 1000);
      entries
        .array()
        .sort(() => Math.random() - 0.5)
        .forEach((c) =>
          Math.random() > 0.5 && success.length <= 15 ? success.push(c) : {}
        );
      const coins = Math.round(amount / success.length);
      const order = success.length
        ? success.map(
            (s) =>
              `+ ${
                s.nickname === null ? s.user.username : s.nickname
              } got ${coins.toLocaleString()}`
          )
        : ['- Everybody died LOL'];
      await channel.send(
        `**Good job everybody, we split up \`${(coins > 1
          ? coins
          : 1
        ).toLocaleString()}\` each!**`
      );

      return {
        code: 'diff',
        content: order.join('\n'),
      };
    });
  }

  private async lockChan(this: Message, bool: boolean): Promise<TextChannel> {
    const change: PermissionOverwriteOption = { SEND_MESSAGES: bool };
    const reason = `JEvent by: ${this.author.tag}} — ${this.author.id}`;
    return await (<TextChannel>this.channel).updateOverwrite(
      this.guild.id,
      change,
      reason
    );
  }
}
