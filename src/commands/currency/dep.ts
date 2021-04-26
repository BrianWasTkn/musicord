import { GuildMember, MessageOptions } from 'discord.js';
import { Context, ContextDatabase } from 'lib/extensions/message';
import { Command } from 'lib/handlers/command';
import { Embed } from 'lib/utility/embed';

export default class Currency extends Command {
  constructor() {
    super('dep', {
      aliases: ['deposit', 'dep', 'put'],
      channel: 'guild',
      description: 'Deposit coins into your vault.',
      category: 'Currency',
      cooldown: 500,
      args: [
        {
          id: 'amount',
          type: async (ctx: Context, args: number | string) => {
            ctx.db = new ContextDatabase(ctx);
            const { pocket, vault, space } = (await ctx.db.fetch()).data;
            if (!args) return null;

            let dep: number | string = args;
            if (!Number.isInteger(Number(dep))) {
              dep = (dep as string).toLowerCase();
              if (['all', 'max'].includes(dep)) {
                dep = Math.round(pocket);
              } else if (dep === 'half') {
                dep = Math.round(pocket / 2);
              } else if ((args as string).match(/k/g)) {
                const kay = (args as string).replace(/k$/g, '');
                dep = Number(kay) ? Number(kay) * 1e3 : null;
              }
            }

            return Number(dep) || Number(args) || args;
          },
        },
      ],
    });
  }

  public async exec(
    ctx: Context<{ amount: number }>
  ): Promise<string | MessageOptions> {
    const userEntry = await ctx.db.fetch();
    const { pocket, vault, space } = userEntry.data;
    const { amount } = ctx.args;

    if (!amount) {
      return { replyTo: ctx.id, content: 'you need to deposit something' };
    }
    if (!Number.isInteger(Number(amount)) || amount < 1) {
      return { replyTo: ctx.id, content: 'it needs to be a whole number greater than 0' };
    }
    if (pocket < 1) {
      return { replyTo: ctx.id, content: 'u have nothing to deposit lmfao' };
    }
    if (amount > pocket) {
      return { replyTo: ctx.id, content: `u only have **${pocket.toLocaleString()}** don't try and break me` };
    }
    if (vault >= space) {
      return { replyTo: ctx.id, content: 'u already have full bank stop pushing it through' };
    }
    if (amount + vault > space) {
      return { replyTo: ctx.id, content: `you can only hold up to **${(space - vault).toLocaleString()}** right now. To hold more, use the bot more.` };
    }

    const input = amount >= space - vault ? space - vault : amount;
    const { vault: nVault } = await userEntry.addCd().deposit(input).updateItems().save();

    return {
      content: `**${input.toLocaleString()}** coins deposited. You now have **${nVault.toLocaleString()}** in your vault.`,
      replyTo: ctx.id,
    };
  }
}
