import { Message, MessageEmbed, MessageOptions } from 'discord.js';
import { Listener, Command } from 'discord-akairo';
import { Lava } from '@lib/Lava';

export default class CommandListener extends Listener {
  client: Lava;

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
    const thing = util.isPromise(returned) ? await returned : returned;
    if (!thing) return;
    await msg.channel.send(thing as MessageOptions);

    // Bank Space
    if (
      !['bal', 'buy', 'dep', 'with', 'shop', 'inv', 'multi'].some(
        (c) => command.id === c || command.aliases.includes(c)
      ) &&
      command.category.id === 'Currency'
    ) {
      const gain = Math.round(55 * (util.randomNumber(1, 100) / 2) + 55);
      await db.currency.add(msg.author.id, 'space', gain);
      return;
    }
  }
}
