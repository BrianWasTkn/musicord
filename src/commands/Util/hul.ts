import { LavaClient, Command } from 'discord-akairo'
import { Message, Snowflake, Role } from 'discord.js'

export default class Util extends Command {
  public client: LavaClient;
  public constructor() {
    super('hunock', {
      aliases: ['hunlock', 'hul'],
      channel: 'guild',
      userPermissions: ['MANAGE_MESSAGES'],
      args: [{
        id: 'role', type: 'role'
      }]
    });
  }

  private embed(display: number, role: Role, color?: string): any {
    return {
      color: color || 'ORANGE',
      title: `**UNLOCKING IN \`${display}\` SECONDS**`,
      footer: {
        text: `Requirement: ${role.name}`,
        iconURL: role.guild.iconURL({ dynamic: true })
      }
    }
  }

  public async exec(_: Message, args: any): Promise<Message> {
    await _.delete();
    const { role, timer } = args;
    if (!role) return;
    const { channel }: any = _;

    const msg = await channel.send({ embed: this.embed(60, role) });
    await this.client.util.sleep(10000);
    await msg.edit({ embed: this.embed(50, role) });
    await this.client.util.sleep(10000);
    await msg.edit({ embed: this.embed(40, role) });
    await this.client.util.sleep(10000);
    await msg.edit({ embed: this.embed(30, role) });
    await this.client.util.sleep(10000);
    await msg.edit({ embed: this.embed(20, role) });
    await this.client.util.sleep(10000);
    await msg.edit({ embed: this.embed(10, role) });
    await this.client.util.sleep(10000);
    await msg.edit({ embed: this.embed(3, role, 'RED') });
    await this.client.util.sleep(1000);
    await msg.edit({ embed: this.embed(2, role, 'RED') });
    await this.client.util.sleep(1000);
    await msg.edit({ embed: this.embed(1, role, 'RED') });
    await this.client.util.sleep(1000);

    const perms = { SEND_MESSAGES: true };
    const updated: any = await channel.updateOverwrite(role.id, perms);
    return channel.send({ embed: {
      title: `Unlocked for **${role.name}**`,
      color: 'ORANGE'
    }});
  }
}
