import { MessageOptions } from 'discord.js';
import { MessagePlus } from '@lib/extensions/message';
import { Listener } from '@lib/handlers';
import { Command } from 'discord-akairo';

export default class CommandListener extends Listener {
  constructor() {
    super('commandFinished', {
      emitter: 'command',
      event: 'commandFinished',
    });
  }

  async exec(
    msg: MessagePlus,
    command: Command,
    _: any[],
    returned: MessageOptions | Promise<MessageOptions>
  ) {
    if (!returned) return;

    const data = await msg.author.fetchDB();
    data.lastRan = Date.now();
    data.lastCmd = command.aliases[0];
    await data.save();
    
    // (await msg.channel.send(returned as MessageOptions)) as MessagePlus;
    return this.client.handlers.command.commandUtils.delete(msg.id);
  }
}
