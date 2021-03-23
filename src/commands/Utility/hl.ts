import { Role, MessageOptions } from 'discord.js';
import { MessagePlus } from '@lib/extensions/message';
import { Command } from '@lib/handlers/command';

export default class Util extends Command {
  constructor() {
    super('hlock', {
      aliases: ['hlock', 'hl'],
      channel: 'guild',
      description: 'Locks the heist channel if you have proper permissions',
      category: 'Utility',
      userPermissions: ['MANAGE_MESSAGES'],
    });
  }

  async exec(msg: MessagePlus): Promise<MessageOptions> {
    await msg.delete();
    const role: Role = this.client.util.heists.get(msg.channel.id);
    if (!role) return;
    const { channel }: any = msg;
    await channel.updateOverwrite(role.id, { SEND_MESSAGES: null });
    return {
      embed: {
        title: `**LOCKED FOR \`${role.name}\`**`,
        color: 'GREEN',
        footer: {
          text: msg.guild.name,
          iconURL: msg.guild.iconURL({ dynamic: true }),
        },
      },
    };
  }
}
