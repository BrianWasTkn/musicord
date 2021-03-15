import { Message, GuildMember, MessageOptions } from 'discord.js';
import { Command } from '@lib/handlers/command';
import { Embed } from '@lib/utility/embed';

export default class Currency extends Command {
  constructor() {
    super('multi', {
      aliases: ['multiplier', 'multi'],
      channel: 'guild',
      description: 'View your current multipliers.',
      category: 'Currency',
      cooldown: 1e3,
      args: [
        {
          id: 'page',
          type: 'number',
          default: 1,
        },
      ],
    });
  }

  public async exec(
    _: Message,
    {
      page,
    }: {
      page: number;
    }
  ): Promise<string | MessageOptions> {
    const { maxMulti } = this.client.config.currency;
    const { utils } = this.client.db.currency;
    const { util } = this.client;
    const multi = await utils.calcMulti(this.client, _);

    const multis = util.paginateArray(multi.unlocked, 5);
    if (page > multis.length) return "That page doesn't exist.";

    const embed: Embed = new Embed()
      .addField(
        `Total Multi — ${multi.total >= maxMulti ? maxMulti : multi.total}%`,
        multis[page - 1].join('\n')
      )
      .setAuthor(
        `${_.member.user.username}'s multipliers`,
        _.author.avatarURL({ dynamic: true })
      )
      .setFooter(
        false,
        `${multi.unlocked.length} active — Page ${page} of ${multis.length}`
      )
      .setColor(util.randomInArray(['GOLD', 'GREEN', 'RED', 'ORANGE']));

    return { embed };
  }
}
