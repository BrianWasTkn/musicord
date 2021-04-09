import { MessagePlus } from '@lib/extensions/message';
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
          default: async (msg: MessagePlus) => {
            const { randomNumber } = this.client.util;
            const { pocket } = await msg.author.fetchDB();
            return Math.round(pocket / randomNumber(1, 5));
          },
        },
      ],
    });
  }

  async exec(msg: MessagePlus, args: { amount: number }): Promise<string> {
    const data = await msg.author.fetchDB();
    const { amount } = args;

    if (!amount) 
      return 'You need something to burn, bruh';
    if (amount < 1) 
      return 'Not allowed, sorry not sorry';
    if (amount > data.pocket)
      return 'Imagine burning money higher than your pocket lmao';

    await msg.author.initDB(data).removePocket(amount).db.save();
    return `Burned **${amount.toLocaleString()}** coins from your pocket.`;
  }
}
