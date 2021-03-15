import { Message } from 'discord.js';
import { Command } from '@lib/handlers/command';

export default class Currency extends Command {
  constructor() {
    super('gimme', {
      aliases: ['gimme'],
      channel: 'guild',
      description: 'Gives you a random amount of coins from 100k to 1m coins',
      category: 'Currency',
      cooldown: 60000,
    });
  }

  async exec({ author, channel }: Message): Promise<string> {
    const { db, config, util } = this.client;
    const { maxPocket, maxBet } = config.currency;
    const { fetch, add } = db.currency;
    const { pocket } = await fetch(author.id);

    if (pocket >= maxPocket) return "You're already rich wtf??";

    const amount = util.randomNumber(1, maxBet as number);
    await add(author.id, 'pocket', amount);
    return `Done adding **${amount.toLocaleString()}** coins to your pocket.`;
  }
}
