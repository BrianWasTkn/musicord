import { Message, MessageEmbed, MessageOptions } from 'discord.js';
import { Listener } from '@lib/handlers';
import { Command } from 'discord-akairo';
import { Effects } from '@lib/utility/effects'
import { Lava } from '@lib/Lava';

export default class CommandListener extends Listener {
  constructor() {
    super('commandFinished', {
      emitter: 'command',
      event: 'commandFinished',
    });
  }

  async exec(
    msg: Message,
    command: Command,
    args: any[],
    returned: MessageOptions | Promise<MessageOptions>
  ): Promise<void | Message | Message[]> {
    const { util, db } = this.client;
    if (!returned) return;
    await msg.channel.send(returned as MessageOptions);

    // Currency
    if (command.category.id === 'Currency') {
      // Bank Space
      const blI = ['bal', 'buy', 'dep', 'with', 'shop', 'inv', 'multi'];
      const isWl = blI.some(c => command.id === c || command.aliases.includes(c));
      if (isWl) {
        const gain = Math.round(55 * (10 / 2) + 55);
        await db.currency.add(msg.author.id, 'space', gain);
        return;
      }
    }
  }
}
