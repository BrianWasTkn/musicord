import { MessagePlus } from '@lib/extensions/message';
import { Listener } from '@lib/handlers'
import { Command } from 'discord-akairo';
import { Lava } from '@lib/Lava';

export default class CommandListener extends Listener {
  constructor() {
    super('cmdBlocked', {
      emitter: 'command',
      event: 'commandBlocked',
    });
  }

  async exec(msg: MessagePlus, cmd: Command, r: string): Promise<void | MessagePlus> {
    if (r.toLowerCase() === 'owner') {
      return msg.channel.send("You're not my owner, bro") as Promise<MessagePlus>;
    } else if (['guild', 'dm'].includes(r.toLowerCase())) {
      return msg.channel.send(`This isn't available in ${r}s, my dear.`) as Promise<MessagePlus>;
    }
  }
}
