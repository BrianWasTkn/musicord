import { GuildMember, MessageOptions } from 'discord.js';
import { MessagePlus } from '@lib/extensions/message';
import { Command } from '@lib/handlers/command';
import { Embed } from '@lib/utility/embed';

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
          type: async (msg: MessagePlus, phrase: number | string) => {
            if (!phrase) {
              msg.reply('You need something to deposit');
              return null;
            }
            const data = await msg.author.fetchDB();
            if (data.pocket < 1) {
              msg.reply("Lol you don't have coins to deposit rip");
              return null;
            }
            if (data.vault >= data.space) {
              msg.reply('You already have full vault');
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
                msg.reply('You actually need a number to deposit...');
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
    msg: MessagePlus,
    {
      amount,
    }: {
      amount: number;
    }
  ): Promise<string | MessageOptions> {
    const d = await msg.author.fetchDB();

    if (!amount) 
      return 'You need something to deposit, bro.';
    if (amount < 1) 
      return 'You thought you can fool me?';
    if (amount > d.pocket)
      return `Bro, you only have ${d.pocket.toLocaleString()} coins what're you doing?`;

    const input = amount >= d.space - d.vault ? d.space - d.vault : amount;
    const { vault } = await msg.author.initDB(d).deposit(input).db.save();

    return {
      content: `**${input.toLocaleString()}** coins deposited. You now have **${vault.toLocaleString()}** in your vault.`,
      replyTo: msg.id,
    };
  }
}
