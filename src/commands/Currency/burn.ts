import { Message } from 'discord.js';
import { Command } from '@lib/handlers/command';

export default class Currency extends Command {
  constructor() {
    super('burn', {
      aliases: ['burn'],
      channel: 'guild',
      description: "Burn a certain amount of coins if you're already max",
      category: 'Currency',
      cooldown: 10e3,
      args: [
        {
          id: 'amount',
          type: 'number',
          default: async (msg: Message) => {
            const { fetch } = this.client.db.currency;
            const { pocket } = await fetch(msg.author.id);
            return Math.round(pocket / 2);
          },
        },
      ],
    });
  }

  async exec(
    _: Message,
    {
      amount,
    }: {
      amount: number | undefined;
    }
  ): Promise<string> {
    const { remove, fetch } = this.client.db.currency;
    const { pocket } = await fetch(_.author.id);

    if (!amount) return 'You need something to burn, bruh';
    else if (amount < 1) return 'Not allowed, sorry not sorry';
    else if (amount >= pocket)
      return 'Imagine burning money higher than your pocket';

    await remove(_.author.id, 'pocket', amount);
    return `Burned **${amount.toLocaleString()}** coins from your pocket.`;
  }
}
