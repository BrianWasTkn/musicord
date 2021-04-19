import { CommandHandler, Command } from '@lib/handlers/command';
import { Context } from '@lib/extensions/message';
import { Listener } from '@lib/handlers';

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
        : this.client.util.parseTime(command.cooldown / 1e3);

    return ctx.send({
      embed: {
        title: 'LOL calm down',
        color: 'INDIGO',
        description: `You're currently on cooldown for the \`${command.id}\` command.\nPlease wait **${time}** and try again.\nDefault cooldown for this command is **${defCd}**!`,
        footer: {
          text: this.client.user.username,
          icon_url: this.client.user.avatarURL(),
        },
      },
    });
  }
}
