import { MessageOptions } from 'discord.js';
import { Context } from 'lib/extensions/message';
import { Command } from 'lib/handlers/command';
import botPackage from 'src/../package.json';

export default class Util extends Command {
  constructor() {
    super('version', {
      aliases: ['version', 'ver'],
      channel: 'guild',
      description: 'Check the current version of this bot.',
      category: 'Utility',
    });
  }

  exec(ctx: Context): MessageOptions {
    return { replyTo: ctx.id, content: `This instance of ${ctx.client.user.username} is running version \`${botPackage.version}\`.` };
  }
}
