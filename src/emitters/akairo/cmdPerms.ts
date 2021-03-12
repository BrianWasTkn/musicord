import { Message, MessageEmbed } from 'discord.js';
import { Listener, Command } from 'discord-akairo';
import { Lava } from '@lib/Lava';

export default class CommandListener extends Listener {
  client: Lava;

  constructor() {
    super('missingPermissions', {
      emitter: 'command',
      event: 'missingPermissions',
    });
  }

  async exec(
    _: Message,
    command: Command,
    type: string,
    missing: any
  ): Promise<Message> {
    type = type === 'client' ? 'I' : 'You';
    const d: string[] = [];
    d.push(`${type} don\'t have enough permissions to run the \`${command.id}\` command.`);
    d.push(`Ensure ${type} have the following permissions:`);

    const embed = new MessageEmbed()
      .setDescription(d.join('\n'))
      .setColor('RED')
      .addField(
        `Missing Permissions • ${missing.length}`,
        `\`${missing.join('`, `')}\``
      )
      .setFooter(this.client.user.username, this.client.user.avatarURL())
      .setTitle('Well rip, no perms.');

    return _.channel.send({ embed });
  }
}
