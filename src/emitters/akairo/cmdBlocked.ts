import { MessagePlus } from '@lib/extensions/message';
import { Listener } from '@lib/handlers';
import { Command } from 'discord-akairo';
import { Lava } from '@lib/Lava';

export default class CommandListener extends Listener {
  constructor() {
    super('cmdBlocked', {
      emitter: 'command',
      event: 'commandBlocked',
    });
  }

  async exec(
    msg: MessagePlus,
    cmd: Command,
    r: string
  ): Promise<void | MessagePlus> {
    r = r.toLowerCase();

    if (r === 'owner') {
      return await msg.channel.send('you\'re not my owner') as MessagePlus;
    }
    if (r === 'dm') {
      return await msg.channel.send('lol this command ain\'t available in dms') as MessagePlus;
    }
  }
}
