import { GuildMember, MessageOptions } from 'discord.js';
import { MessagePlus } from '@lib/extensions/message';
import { Command } from '@lib/handlers/command';
import { Embed } from '@lib/utility/embed';

export default class Currency extends Command {
  constructor() {
    super('with', {
      aliases: ['withdraw', 'with', 'take'],
      channel: 'guild',
      description: 'Withdraw coins from your vault.',
      category: 'Currency',
      cooldown: 1e3,
      args: [
        {
          id: 'amount',
          type: async (msg: MessagePlus, phrase: number | string) => {
            if (!phrase) {
              await msg.reply('You need something to withdraw');
              return null;
            }

            const data = await msg.author.fetchDB();
            if (data.vault < 1) {
              await msg.reply('You have nothing to withdraw');
              return null;
            }

            let withd: string | number = phrase;
            if (!Boolean(Number(withd))) {
              withd = (withd as string).toLowerCase();
              if (['all', 'max'].some(p => p.toLowerCase() === withd)) {
                withd = data.vault;
              } else if (phrase === 'half') {
                withd = Math.round(data.vault / 2);
              } else {
                await msg.channel.send('You need a number to deposit.');
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
    msg: MessagePlus,
    {
      amount,
    }: {
      amount: number;
    }
  ): Promise<string | MessageOptions> {
    const d = await msg.author.fetchDB();
    const embed: Embed = new Embed();

    if (!amount)
      return;
    else if (amount < 1)
      return 'Thought you can fool me?';
    else if (amount > d.vault)
      return `Bro, you only have ${d.vault.toLocaleString()} coins in your vault what're you up to?`;

    await msg.author.initDB(d).withdraw(amount).db.save();
    return `**${amount.toLocaleString()}** coins withdrawn.`;
  }
}
