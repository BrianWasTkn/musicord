import { GuildMember, MessageOptions } from 'discord.js';
import { Context } from '@lib/extensions/message';
import { Command } from '@lib/handlers/command';
import { Embed } from '@lib/utility/embed';

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
          type: async (msg: Context, phrase: number | string) => {
            if (!phrase) {
              msg.reply('You need something to withdraw');
              return null;
            }

            const data = await msg.author.fetchDB();
            if (data.vault < 1) {
              msg.reply('You have nothing to withdraw');
              return null;
            }

            let withd: string | number = phrase;
            if (!Boolean(Number(withd))) {
              withd = (withd as string).toLowerCase();
              if (['all', 'max'].some((p) => p.toLowerCase() === withd)) {
                withd = data.vault;
              } else if (phrase === 'half') {
                withd = Math.round(data.vault / 2);
              } else {
                msg.reply('You need a number to deposit.');
                return null;
              }
            }

            return Math.trunc(Number(withd));
          },
        },
      ],
    });
  }

  public async exec(
    ctx: Context<{ amount: number }>
  ): Promise<string | MessageOptions> {
    const { data: d } = await ctx.db.fetch();
    const { amount } = ctx.args;
    const embed: Embed = new Embed();

    if (!amount) return;
    else if (amount < 1) return 'Thought you can fool me?';
    else if (amount > d.vault)
      return `Bro, you only have ${d.vault.toLocaleString()} coins in your vault what're you up to?`;

    const { vault } = await ctx.db.withdraw(amount).save();
    return {
      replyTo: ctx.id,
      content: `**${amount.toLocaleString()}** coins withdrawn. You now have **${vault.toLocaleString()}** left in your vault.`,
    };
  }
}
