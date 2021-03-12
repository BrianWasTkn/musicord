import { Message } from 'discord.js';
import { Command } from '@lib/handlers/command';

export default class Currency extends Command {
  constructor() {
    super('gimme', {
      aliases: ['gimme'],
      channel: 'guild',
      description: 'Gives you a random amount of coins from 100k to 1m coins',
      category: 'Currency',
      cooldown: 5000,
    });
  }

  async exec({
    author, channel
  }: Message): Promise<string> {
    const { db, config, util } = this.client;
    const { fetch, add } = db.currency;
    const { maxPocket } = config.currency;
    const { pocket } = await fetch(author.id);

    if (pocket >= maxPocket)
      return 'You\'re already rich wtf??';

    const amount = util.randomNumber(1, <number>maxPocket - pocket);
    await add(author.id, 'pocket', amount);
    return `Successfully added **${amount.toLocaleString()}** coins to your pocket.`;
  }
}
