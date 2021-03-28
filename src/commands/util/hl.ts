import { MessagePlus } from '@lib/extensions/message';
import { Command } from '@lib/handlers/command';
import {
  PermissionOverwriteOption,
  MessageOptions,
  TextChannel,
  Role,
} from 'discord.js';

export default class Util extends Command {
  constructor() {
    super('hlock', {
      aliases: ['hlock', 'hl'],
      channel: 'guild',
      description: 'Locks the heist channel if you have proper permissions.',
      category: 'Utility',
      userPermissions: ['MANAGE_MESSAGES'],
    });
  }

  async exec(msg: MessagePlus): Promise<MessageOptions> {
    await msg.delete();

    const role: Role = this.client.util.heists.get(msg.channel.id);
    if (!role) return;

    const reason = `Heist Lock — ${msg.author.tag}`;
    const owrite: PermissionOverwriteOption = { SEND_MESSAGES: null };
    await (msg.channel as TextChannel).updateOverwrite(role.id, owrite, reason);

    return {
      embed: {
        description: `**Locked for ${role.toString()} role.**`,
        title: `Channel Locked`,
        color: 'RED',
        footer: {
          text: msg.guild.name,
          iconURL: msg.guild.iconURL({ dynamic: true }),
        },
      },
    };
  }
}
