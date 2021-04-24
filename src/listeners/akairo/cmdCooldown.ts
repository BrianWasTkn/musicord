import { CommandHandler, Command } from 'lib/handlers/command';
import { Context } from 'lib/extensions/message';
import { Listener } from 'lib/handlers';

export default class CommandListener extends Listener<CommandHandler<Command>> {
  constructor() {
    super('cooldown', {
      emitter: 'command',
      event: 'cooldown',
    });
  }

  async exec(ctx: Context, command: Command, remaining: number) {
    const time =
      remaining <= 60e3
        ? `${(remaining / 1e3).toFixed(1)} seconds`
        : this.client.util.parseTime(remaining / 1e3);
    const defCd =
      command.cooldown <= 60e3
        ? `${command.cooldown / 1e3} seconds`
        : this.client.util.parseTime(command.cooldown / 1e3, false);

    return ctx.send({
      embed: {
        title: 'Hold up nelly',
        color: 'INDIGO',
        description: `You're currently on cooldown for the \`${command.id}\` command.\nYou can use this command in **${time}**\nYou only need to wait **${defCd}** by default!`,
        footer: {
          text: this.client.user.username,
          icon_url: this.client.user.avatarURL(),
        },
      },
    });
  }
}
