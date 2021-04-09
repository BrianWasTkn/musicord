import { MessagePlus } from '@lib/extensions/message';
import { TextChannel } from 'discord.js';
import { Listener } from '@lib/handlers';
import { Command } from 'discord-akairo';

export default class CommandListener extends Listener {
  constructor() {
    super('cmdError', {
      emitter: 'command',
      event: 'commandError',
    });
  }

  async exec(
    msg: MessagePlus,
    __: Command,
    _: any[],
    error: Error
  ): Promise<void | MessagePlus> {
    console.error(error.stack);
    const channel = await this.client.channels.fetch('789692296094285825');
    (channel as TextChannel).send(error.message);
    return msg.channel.send(error.message) as Promise<MessagePlus>;
  }
}
