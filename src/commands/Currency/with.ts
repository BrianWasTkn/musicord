import { Message, GuildMember, MessageOptions } from 'discord.js';
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
          type: async (msg: Message, phrase: number | string) => {
            if (!phrase) {
              await msg.reply('You need something to withdraw');
              return null;
            }

            const data = await this.client.db.currency.fetch(msg.author.id);
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

            return Number(withd);
          },
        },
      ],
    });
  }

  public async exec(
    _: Message,
    {
      amount,
    }: {
      amount: number;
    }
  ): Promise<string | MessageOptions> {
    const { fetch, add, remove } = this.client.db.currency;
    const { pocket, vault, space } = await fetch(_.author.id);
    const embed: Embed = new Embed();
    if (!amount) return;
    if (amount < 1) return 'Thought you can fool me?'

    if (amount > vault) {
      return `Bro, you only have ${vault.toLocaleString()} coins in your vault what're you up to?`;
    }

    await add(_.author.id, 'pocket', amount);
    await remove(_.author.id, 'vault', amount);
    return `**${amount.toLocaleString()}** coins withdrawn.`;
  }
}
