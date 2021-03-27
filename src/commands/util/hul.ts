import { MessagePlus } from '@lib/extensions/message';
import { Command } from '@lib/handlers/command';
import { 
  PermissionOverwriteOption, 
  MessageOptions, 
  GuildChannel,
  TextChannel, 
  Role, 
} from 'discord.js';

export default class Util extends Command {
  constructor() {
    super('hunlock', {
      aliases: ['hunlock', 'hul'],
      channel: 'guild',
      userPermissions: ['MANAGE_MESSAGES'],
      description: 'Unlocks the heist channel if you have right permissions',
      category: 'Utility',
      args: [
        {
          id: 'role',
          type: 'role',
          default: (m: MessagePlus) => m.guild.roles.cache.get(m.guild.id)
        },
        {
          id: 'interval',
          type: 'number',
          default: 10,
        },
      ],
    });
  }

  private embed(display: number, role: Role, color?: string): any {
    return {
      color: color || 'ORANGE',
      title: `Unlocking In...`,
      description: `**${display}** seconds.`,
      footer: {
        text: `Requirement: ${role.name}`,
        iconURL: role.guild.iconURL({ dynamic: true }),
      },
    };
  }

  async exec(_: MessagePlus, args: any): Promise<MessageOptions> {
    await _.delete();
    const { role, interval } = args;
    if (!role) return;

    let num = 60;
    let msg = await _.channel.send({ 
      embed: this.embed(num, role, 'ORANGE'),
    });

    const run = async (int: number) => {
      if (num === 10) {
        await this.client.util.sleep(7e3);
        await msg.edit({ embed: this.embed(3, role, 'RED') });
        await this.client.util.sleep(1e3);
        await msg.edit({ embed: this.embed(2, role, 'RED') });
        await this.client.util.sleep(1e3);
        await msg.edit({ embed: this.embed(1, role, 'RED') });
        await this.client.util.sleep(1e3);
        await msg.edit({ embed: this.embed(0, role, 'RED') });
        return num;
      }

      await this.client.util.sleep(int * 1e3);
      num -= 10;
      msg = await msg.edit({ embed: this.embed(num, role, 'ORANGE') });
      return await run(int);
    };

    await run(interval);
    
    const reason = `Heist Unlock — ${msg.author.tag}`;
    const perms: PermissionOverwriteOption = { SEND_MESSAGES: true };
    (msg.channel as TextChannel).updateOverwrite(role.id, perms, reason);
    this.client.util.heists.set(msg.channel.id, role);

    return {
      embed: {
        description: `**Unlocked for ${role.toString()} role.**`,
        title: `Channel Unlocked`,
        color: 'GREEN',
        footer: {
          text: _.guild.name,
          iconURL: _.guild.iconURL({ dynamic: true }),
        },
      },
    };
  }
}
