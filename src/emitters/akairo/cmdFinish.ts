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
      thing.content = returned;
      return await msg.channel.send(thing);
    }

    for (const option of ['disableMentions', 'reply', 'code']) {
      if (option in returned) {
        thing[option] = returned[option];
      }
    }

    if (returned.embed) {
      thing.embed = returned.embed;
      if (!returned.embed.color) {
        thing.embed = Object.assign(thing.embed, {
          color: this.client.util.randomColor(),
        });
      }
    }

    return await msg.channel.send(thing);
  }
}
