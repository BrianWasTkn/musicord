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
    returned: MessageOptions
  ): Promise<void | Message | Message[]> {
    return console.log({ msg, command, args, returned })
    if (!returned) return;
    return await msg.channel.send(returned);
  }
}
