import { MessageOptions } from 'discord.js';
import { MemberPlus } from 'lib/extensions/member';
import { Context } from 'lib/extensions/message';
import { Command } from 'lib/handlers/command';
import config from 'config/index';

export default class Currency extends Command {
  constructor() {
    super('profile', {
      aliases: ['profile', 'level'],
      channel: 'guild',
      description: "View basic info about your currency progress.",
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
      db: { currency: { utils } },
      util: { parseTime, toRoman },
      handlers: { item },
    } = this.client;
    const { data } = await ctx.db.fetch(ctx.args.member.user.id, ctx.author.id === ctx.args.member.user.id);
    const { pocket, vault, stats, items } = data;
    const stamp = ctx.createdTimestamp, actives = items
    .filter((i) => i.expire > stamp)
    .map((i) => {
      const it = item.modules.get(i.id);
      const expire = parseTime(Math.floor((i.expire - stamp) / 1e3), true);
      return `**${it.emoji} ${it.name}** — expires in ${expire}`;
    });

    const winRate = stats.wins / (stats.wins + stats.loses);
    const gamble = Object.entries({
      'Total Lost': stats.lost.toLocaleString(),
      'Total Won': stats.won.toLocaleString(),
      'Win Rate': `${Number(winRate.toFixed(2)) * 100}%`
    }).map(([k, v]) => `\`${k}:\` ${v}`);

    const level = Math.min(config.currency.maxLevel, (
      (stats.xp / 1e3) > 0 ? Math.round(stats.xp / 1e3) : 0
    ));
    const coins = [
      `**${pocket.toLocaleString()}** in pocket`,
      `**${vault.toLocaleString()}** in vault`,
      `**${utils.calcMulti(ctx, data).total}%** multiplier`,
    ];

    let desc: string[] = [];
    if (stats.prestige > 0) desc.push(`**Prestige ${toRoman(stats.prestige)}`);

    return { embed: {
      description: desc.join('\n'),
      author: {
        name: `${ctx.args.member.user.username}'s profile`,
        icon_url: ctx.args.member.user.avatarURL({ dynamic: true })
      },
      color: 'BLURPLE', fields: [
        { inline: true, name: 'Level', value: `**${level.toLocaleString()} / ${config.currency.maxLevel.toLocaleString()}**` },
        { inline: true, name: 'Experience', value: `**${(data.stats.xp).toLocaleString()} / ${(config.currency.maxLevel * 1e2).toLocaleString()}**` },
        { inline: true, name: 'Coins', value: coins.join('\n') },
        { inline: false, name: 'Gambling', value: gamble.join('\n') },
        { inline: false, name: 'Items', value: actives.length >= 1 ? actives.join('\n') : 'No active items.' },
      ]
    }};
  }
}
