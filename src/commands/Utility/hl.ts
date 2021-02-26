import { Message, Role } from 'discord.js';
import { Command } from 'discord-akairo';

export default class Util extends Command {
  public client: Akairo.Client;

  constructor() {
    super('hlock', {
      aliases: ['hlock', 'hl'],
      channel: 'guild',
      description: 'Locks the heist channel if you have proper permissions',
      category: 'Utility',
      userPermissions: ['MANAGE_MESSAGES'],
    });
  }

  async exec(_: Message): Promise<Message> {
    await _.delete();
    const role: Role = this.client.util.heists.get(_.channel.id);
    if (!role) return;
    const { channel }: any = _;
    await channel.updateOverwrite(role.id, { SEND_MESSAGES: null });
    return _.channel.send({
      embed: {
        title: `**LOCKED FOR \`${role.name}\`**`,
        color: 'GREEN',
        footer: {
          text: _.guild.name,
          iconURL: _.guild.iconURL({ dynamic: true }),
        },
      },
    });
  }
}
