import { Listener, Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { Lava } from '@lib/Lava';

export default class CommandListener extends Listener {
  client: Lava;

  constructor() {
    super('cmdBlocked', {
      emitter: 'command',
      event: 'commandBlocked',
    });
  }

  async exec(
    msg: Message, 
    cmd: Command, 
    r: string
  ): Promise<void | Message> {
    if (r === 'owner') {
      return msg.channel.send("You're not my owner, bro");
    } else if (['guild', 'dm'].includes(r)) {
      return msg.channel.send(`This isn't available in ${r}s, my dear.`);
    }
  }
}
