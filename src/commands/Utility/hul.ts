import { Message, Role, GuildChannel, MessageOptions } from 'discord.js';
import { Command } from '@lib/handlers/command';

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
          default: (m: Message) => m.guild.id,
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
      title: `**UNLOCKING IN \`${display}\` SECONDS**`,
      footer: {
        text: `Requirement: ${role.name}`,
        iconURL: role.guild.iconURL({ dynamic: true }),
      },
    };
  }

  async exec(_: Message, args: any): Promise<MessageOptions> {
    await _.delete();
    const { role, interval } = args;
    if (!role) return;
    const { channel }: any = _;

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
      msg = await msg.edit({ embed: this.embed(num, role, 'ORANGE') });
      num -= 10;
      return await run(int);
    };

    await run(interval);
    const perms = { SEND_MESSAGES: true };
    (<GuildChannel>_.channel).updateOverwrite(role.id, perms);
    this.client.util.heists.set(channel.id, role);
    return {
      embed: {
        title: `**UNLOCKED FOR \`${role.name}\`**`,
        color: 'GREEN',
        footer: {
          text: _.guild.name,
          iconURL: _.guild.iconURL({ dynamic: true }),
        },
      },
    };
  }
}
