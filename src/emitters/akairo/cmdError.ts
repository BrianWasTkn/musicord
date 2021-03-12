import { Message, TextChannel } from 'discord.js';
import { Listener, Command } from 'discord-akairo';
import { Lava } from '@lib/Lava';

export default class CommandListener extends Listener {
  client: Lava;

  constructor() {
    super('cmdError', {
      emitter: 'command',
      event: 'commandError',
    });
  }

  async exec(
    msg: Message,
    cmd: Command,
    args: any[],
    error: Error
  ): Promise<void | Message> {
    const channel = await this.client.channels.fetch('789692296094285825');
    ((await channel) as TextChannel).send(error.message);
    return msg.channel.send(error.message);
  }
}
