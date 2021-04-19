import { ListenerHandler, Listener } from '@lib/handlers';
import { CommandHandler, Command } from '@lib/handlers';
import { Context } from '@lib/extensions/message';

export default class CommandListener extends Listener<CommandHandler<Command>> {
  constructor() {
    super('cmdBlocked', {
      emitter: 'command',
      event: 'commandBlocked',
    });
  }

  async exec(ctx: Context, cmd: Command, reason: string) {
    function getMessage(reason: string) {
      switch (reason.toLowerCase()) {
        case 'owner':
          return "You're not my bot owner :P";
        case 'dm':
          return 'Not usable in guilds sorry';
        case 'guild':
          return 'Not usable in DMs sorry';
        default:
          return "You can't use this command for no reason wtf";
      }
    }

    return await ctx.send({ content: getMessage(reason) });
  }
}
