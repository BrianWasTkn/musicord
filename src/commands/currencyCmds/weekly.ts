import { MessageOptions } from 'discord.js';
import { MessagePlus } from '@lib/extensions/message';
import { Command } from '@lib/handlers/command';

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

  public async exec(msg: MessagePlus): Promise<string | MessageOptions> {
    const data = await msg.author.fetchDB();
    const won = 150000;

    await msg.author.initDB(data).addPocket(won).db.save();
    return { embed: {
      title: `Here are your daily coins, ${msg.author.username}`,
      description: `**${won.toLocaleString()}** were placed in your pocket.`,
      color: 'INDIGO', footer: { text: `Thanks for supporting this trash bot!` }
    }};
  }
}
