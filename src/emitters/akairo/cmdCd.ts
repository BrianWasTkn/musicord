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
    const description: string[] = [];
    description.push(`You're currently on cooldown for the \`${command.id}\` command.`);
    description.push(`Please wait **${(remaining / 1000).toFixed(2)}** seconds and try again.`);

    return _.channel.send({ embed: {
      title: 'Calm down buddy',
      color: 'RED',
      description: 
      `You're currently on cooldown for the \`${command.id}\` command.
      Please wait **${(remaining / 100).toFixed(2)}** seconds and try again.`,
      footer: {
        text: this.client.user.username,
        icon_url: this.client.user.avatarURL()
      }
    }});
  }
}
