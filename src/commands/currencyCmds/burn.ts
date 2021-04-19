import { Context } from '@lib/extensions/message';
import { Command } from '@lib/handlers/command';

export default class Currency extends Command {
  constructor() {
    super('burn', {
      aliases: ['burn'],
      channel: 'guild',
      description: "Burn a certain amount of coins if you're already max",
      category: 'Currency',
      cooldown: 6e4,
      args: [
        {
          id: 'amount',
          type: 'number',
          default: async (ctx: Context) => {
            const { pocket } = (await ctx.db.fetch()).data;
            return Math.round(pocket / 2);
          },
        },
      ],
    });
  }

  async exec(ctx: Context<{ amount: number }>): Promise<string> {
    const { data } = await ctx.db.fetch();
    const { amount } = ctx.args;

    if (!amount) return 'You need something to burn, bruh';
    if (amount < 1) return 'Not allowed, sorry not sorry';
    if (amount > data.pocket)
      return 'Imagine burning money higher than your pocket lmao';

    await ctx.db.removePocket(amount).save();
    return `Burned **${amount.toLocaleString()}** coins from your pocket.`;
  }
}
