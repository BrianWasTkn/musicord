import { Listener, CommandHandler, Command } from '@lib/handlers';
import { MessageOptions } from 'discord.js';
import { Context } from '@lib/extensions/message';

export default class CommandListener extends Listener<CommandHandler<Command>> {
  constructor() {
    super('commandFinished', {
      emitter: 'command',
      event: 'commandFinished',
    });
  }

  async exec(
    ctx: Context,
    command: Command,
    _: any[],
    returned: MessageOptions | Promise<MessageOptions>
  ) {
    if (!returned) return;

    const { data } = await ctx.db.fetch();
    data.lastRan = Date.now();
    data.lastCmd = command.aliases[0];
    await data.save();

    // (await msg.channel.send(returned as MessageOptions)) as Context;
    return this.client.handlers.command.commandUtils.delete(ctx.id);
  }
}
