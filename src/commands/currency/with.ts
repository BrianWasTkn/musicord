import { GuildMember, MessageOptions } from 'discord.js';
import { Context, ContextDatabase } from 'lib/extensions/message';
import { Command } from 'lib/handlers/command';
import { Embed } from 'lib/utility/embed';

export default class Currency extends Command {
  constructor() {
    super('with', {
      aliases: ['withdraw', 'with', 'take'],
      channel: 'guild',
      description: 'Withdraw coins from your vault.',
      category: 'Currency',
      cooldown: 5e2,
      args: [
        {
          id: 'amount',
          type: async (ctx: Context, args: number | string) => {
            ctx.db = new ContextDatabase(ctx);
            const { pocket, vault, space } = (await ctx.db.fetch()).data;
            if (!args) return null;

            let withd: number | string = args;
            if (!Number.isInteger(Number(withd))) {
              withd = (withd as string).toLowerCase();
              if (['all', 'max'].includes(withd)) {
                withd = Math.round(vault);
              } else if (withd === 'half') {
                withd = Math.round(vault / 2);
              } else if ((args as string).match(/k/g)) {
                const kay = (args as string).replace(/k$/g, '');
                withd = Number(kay) ? Number(kay) * 1e3 : null;
              }
            }

            return Number(withd) || Number(args) || args;
          },
        },
      ],
    });
  }

  public async exec(
    ctx: Context<{ amount: number }>
  ): Promise<MessageOptions> {
    const userEntry = await ctx.db.fetch();
    const { pocket, vault, misc } = userEntry.data;
    const { amount } = ctx.args;

    if (!amount) {
      return { replyTo: ctx.id, content: 'you need to deposit something' };
    }
    if (misc.beingHeisted) {
      return { replyTo: ctx.id, content: 'you\'re being heisted so you can\'t withdraw coins lmao' };
    }
    if (!Number.isInteger(Number(amount)) || amount < 1) {
      return { replyTo: ctx.id, content: 'it needs to be a whole number greater than 0' };
    }
    if (vault < 0) {
      return { replyTo: ctx.id, content: 'u have nothing to withdraw LOL' };
    }
    if (amount > vault) {
      return { replyTo: ctx.id, content: `u only have **${vault.toLocaleString()}** don't try and break me` };
    }

    const { vault: n } = await userEntry.addCd().withdraw(Math.round(amount)).updateItems().save();
    return {
      replyTo: ctx.id,
      content: `**${amount.toLocaleString()}** coins withdrawn. You now have **${n.toLocaleString()}** in your vault.`,
    };
  }
}
