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
          type: async (msg: Context, phrase: number | string) => {
            if (!phrase) {
              msg.reply('You need something to withdraw');
              return null;
            }

            const { data } = await (msg.db = new ContextDatabase(msg)).fetch();
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
    const userEntry = await ctx.db.fetch();
    const { pocket, vault } = userEntry.data;
    const { amount } = ctx.args;
    const embed: Embed = new Embed();

    if (!amount) return;
    else if (amount < 1) return 'Thought you can fool me?';
    else if (amount > vault)
      return `Bro, you only have ${vault.toLocaleString()} coins in your vault what're you up to?`;

    const { vault: n } = await userEntry.withdraw(amount).save();
    return {
      replyTo: ctx.id,
      content: `**${amount.toLocaleString()}** coins withdrawn. You now have **${n.toLocaleString()}** left in your vault.`,
    };
  }
}
