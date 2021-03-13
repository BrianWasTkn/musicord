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
  ): Promise<Message | Message[]> {
    if (!returned) return;

    // string-based returns
    if (typeof returned === 'string') {
      return await msg.channel.send(returned);
    }

    if (!returned.embed.color) {
      returned.embed = {
        ...returned.embed,
        color: this.client.util.randomColor()
      }
    }

    return await msg.channel.send(returned);
  }
}
