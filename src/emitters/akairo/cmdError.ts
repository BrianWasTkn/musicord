import { Message, TextChannel } from 'discord.js';
import { Listener } from '@lib/handlers';
import { Command } from 'discord-akairo';
import { Lava } from '@lib/Lava';

export default class CommandListener extends Listener {
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
    console.error(error.stack)
    const channel = await this.client.channels.fetch('789692296094285825');
    (channel as TextChannel).send(error.message);
    return msg.channel.send(error.message);
  }
}
