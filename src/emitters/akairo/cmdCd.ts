import { MessageEmbed } from 'discord.js';
import { MessagePlus } from '@lib/extensions/message';
import { Listener } from '@lib/handlers';
import { Command } from 'discord-akairo';
import { Lava } from '@lib/Lava';

export default class CommandListener extends Listener {
  constructor() {
    super('cooldown', {
      emitter: 'command',
      event: 'cooldown',
    });
  }

  async exec(
    msg: MessagePlus,
    command: Command,
    remaining: number
  ): Promise<MessagePlus> {
    return msg.channel.send({
      embed: {
        title: 'Calm the frick down',
        color: 'RED',
        description: `You're currently on cooldown for the \`${command.id}\` command.\nPlease wait **${(remaining / 1000).toFixed(2)}** seconds and try again.\nThe default cooldown for this command is \`${command.cooldown / 1000}\` seconds!`,
        footer: {
          text: this.client.user.username,
          icon_url: this.client.user.avatarURL(),
        },
      },
    }) as Promise<MessagePlus>;
  }
}
