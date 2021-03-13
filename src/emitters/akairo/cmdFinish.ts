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
  ): Promise<Message | Message[]> {
    if (!returned) return;

    const thing = this.client.util.isPromise(returned) ? (await returned) : returned;
    return await msg.channel.send(thing as MessageOptions);
  }
}
