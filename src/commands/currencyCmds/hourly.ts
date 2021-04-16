import { MessageOptions } from 'discord.js';
import { MessagePlus } from '@lib/extensions/message';
import { Command } from '@lib/handlers/command';

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

  public async exec(msg: MessagePlus): Promise<string | MessageOptions> {
    const data = await msg.author.fetchDB();
    const won = 1000;

    await msg.author.initDB(data).addPocket(won).db.save();
    return { embed: {
      title: `Here are your hourly coins, ${msg.author.username}`,
      description: `**${won.toLocaleString()}** were placed in your pocket.`,
      color: 'RANDOM', footer: { text: `Thanks for supporting this trash bot!` }
    }};
  }
}
