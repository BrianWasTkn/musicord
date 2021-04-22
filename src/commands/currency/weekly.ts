import { MessageOptions } from 'discord.js';
import { Context } from 'lib/extensions/message';
import { Command } from 'lib/handlers/command';

export default class Currency extends Command {
  constructor() {
    super('weekly', {
      aliases: ['weekly', '7d'],
      channel: 'guild',
      description: 'Claim your weekly rewards.',
      category: 'Currency',
      cooldown: 1e3 * 60 * 60 * 24 * 7,
    });
  }

  public async exec(ctx: Context): Promise<string | MessageOptions> {
    const { data } = await ctx.db.fetch();
    const won = 150000;

    await ctx.db.addPocket(won).save();
    return {
      embed: {
        title: `Here are your daily coins, ${ctx.author.username}`,
        description: `**${won.toLocaleString()}** were placed in your pocket.`,
        color: 'INDIGO',
        footer: { text: `Thanks for supporting this trash bot!` },
      },
    };
  }
}
