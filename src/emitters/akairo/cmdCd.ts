import { Message, MessageEmbed } from 'discord.js';
import { Listener, Command } from 'discord-akairo';
import { Lava } from '@lib/Lava';

export default class CommandListener extends Listener {
  client: Lava;

  constructor() {
    super('cooldown', {
      emitter: 'command',
      event: 'cooldown',
    });
  }

  async exec(
    _: Message,
    command: Command,
    remaining: number
  ): Promise<Message> {
    return _.channel.send({
      embed: {
        title: 'Calm the frick down',
        color: 'RED',
        description: `You're currently on cooldown for the \`${command.id}\` command.\nPlease wait **${(remaining / 1000).toFixed(2)}** seconds and try again.\nThe default cooldown for this command is \`${command.cooldown / 1000}\` seconds!`,
        footer: {
          text: this.client.user.username,
          icon_url: this.client.user.avatarURL(),
        },
      },
    });
  }
}
