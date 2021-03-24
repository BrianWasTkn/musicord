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
    args: any[],
    returned: MessageOptions | Promise<MessageOptions>
  ): Promise<void | MessagePlus | MessagePlus[]> {
    const { util, db } = this.client;
    if (!returned) return;
    
    await msg.channel.send(returned as MessageOptions) as MessagePlus;
    await msg.author.updateItems();
  }
}
