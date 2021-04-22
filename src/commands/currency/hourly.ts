import { MessageOptions } from 'discord.js';
import { Context } from 'lib/extensions/message';
import { Command } from 'lib/handlers/command';

export default class Currency extends Command {
  constructor() {
    super('hourly', {
      aliases: ['hourly', '1h'],
      channel: 'guild',
      description: 'Claim your hourly coins.',
      category: 'Currency',
      cooldown: 1e3 * 60 * 60,
    });
  }

  async exec(ctx: Context): Promise<string | MessageOptions> {
    const { data } = await ctx.db.fetch();
    const won = 1000;

    await ctx.db.addPocket(won).save();
    return {
      embed: {
        title: `Here are your hourly coins, ${ctx.author.username}`,
        description: `**${won.toLocaleString()}** were placed in your pocket.`,
        color: 'RANDOM',
        footer: { text: `Thanks for supporting this trash bot!` },
      },
    };
  }
}
