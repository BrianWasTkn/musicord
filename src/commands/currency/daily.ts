import { MessageOptions } from 'discord.js';
import { Context } from 'lib/extensions/message';
import { Command } from 'lib/handlers/command';

export default class Currency extends Command {
  constructor() {
    super('daily', {
      aliases: ['daily', '24hr'],
      channel: 'guild',
      description: 'Claim your daily coins.',
      category: 'Currency',
      cooldown: 1e3 * 60 * 60 * 24,
    });
  }

  public async exec(ctx: Context): Promise<string | MessageOptions> {
    const userEntry = await ctx.db.fetch();
    const data = userEntry.data;
    let { streak, time } = data.daily;

    if (Date.now() - time > 172800000) {
      userEntry.resetDailyStreak();
      streak = 1;
    } else {
      userEntry.addDailyStreak();
      streak += 1;
    }

    let won = 10000;
    const streakBonus = Math.round(0.15 * won * streak);
    if (streak > 1) won += streakBonus;
    await userEntry.recordDailyStreak().addPocket(won).save();

    return {
      embed: {
        title: `Here are your daily coins, ${ctx.author.username}`,
        description: `**${won.toLocaleString()}** were placed in your pocket.`,
        color: 'BLUE',
        footer: {
          text: `Streak: ${streak} days (+${streakBonus.toLocaleString()})`,
        },
      },
    };
  }
}
