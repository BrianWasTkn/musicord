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
          type: async (ctx: Context, phrase: number | string) => {
            if (!phrase) {
              ctx.reply('You need something to deposit.');
              return null;
            }

            const { data } = await (ctx.db = new ContextDatabase(ctx)).fetch();
            if (data.pocket < 1) {
              ctx.reply("You're an idiot, you don't have anything to deposit.");
              return null;
            }
            if (data.vault >= data.space) {
              ctx.reply('You already have full vault.');
              return null;
            }

            let dep: string | number = phrase;
            if (!Boolean(Number(dep))) {
              dep = (<string>dep).toLowerCase();
              if (['all', 'max'].some((p) => p.toLowerCase() === dep)) {
                dep = data.pocket;
              } else if (phrase === 'half') {
                dep = Math.round(data.pocket / 2);
              } else {
                ctx.reply('You actually need a number to deposit...');
                return null;
              }
            } else {
              dep = Number(dep as number);
              if (dep >= data.pocket) {
                ctx.reply(
                  `Are you fr? You only have ${data.pocket} in your pocket right now. Don't try and break me.`
                );
                return null;
              } else if (dep > data.space - data.vault) {
                ctx.reply(
                  `NOPE! Can't break me, you can only deposit up to **${(
                    data.space - data.vault
                  ).toLocaleString()}** coins right now.`
                );
                return null;
              }
            }

            return Math.trunc(Number(dep));
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

    if (!amount) return;
    if (amount < 1) return 'You thought you can fool me?';
    if (amount > pocket)
      return `Bro, you only have ${pocket.toLocaleString()} coins what're you doing?`;

    const input = amount >= space - vault ? space - vault : amount;
    const { vault: nVault } = await userEntry.deposit(input).updateItems().save();

    return {
      content: `**${input.toLocaleString()}** coins deposited. You now have **${nVault.toLocaleString()}** in your vault.`,
      replyTo: ctx.id,
    };
  }
}
