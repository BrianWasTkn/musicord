import { Listener, Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { Lava } from '@lib/Lava'

export default class extends Listener {
  client: Lava;

  constructor() {
    super('cmdBlocked', {
      emitter: 'commandHandler',
      event: 'commandBlocked',
    });
  }

  async exec(msg: Message, cmd: Command, r: string): Promise<void | Message> {
    const owner = r === 'owner';
    if (owner) {
      return msg.channel.send('You\'re not my owner, bro');
    } else if (!owner) {
      if (r === 'guild') {
        return msg.channel.send('This command doesn\'t work in guilds');
      } else if (r === 'dm') {
        return msg.channel.send('This command doesn\'t work in DMs');
      }
    }

    return void 0;
  }
}
