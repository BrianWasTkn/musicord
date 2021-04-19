import { CommandHandler, Command, Listener } from '@lib/handlers';
import { TextChannel } from 'discord.js';
import { Context } from '@lib/extensions/message';

export default class CommandListener extends Listener<CommandHandler<Command>> {
  constructor() {
    super('cmdError', {
      emitter: 'command',
      event: 'commandError',
    });
  }

  async exec(ctx: Context, __: Command, _: any[], error: Error) {
    console.error(error.stack);
    const channel = await this.client.channels.fetch('789692296094285825');
    (channel as TextChannel).send(error.message);
    return ctx.send({ content: error.message });
  }
}
