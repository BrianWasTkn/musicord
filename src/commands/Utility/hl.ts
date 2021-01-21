import { Message, Snowflake, Role } from 'discord.js'
import Lava from 'discord-akairo'

export default class Util extends Lava.Command {
  public client: Lava.Client;
  public constructor() {
    super('hlock', {
      aliases: ['hlock', 'hl'],
      channel: 'guild',
      userPermissions: ['MANAGE_MESSAGES']
    });
  }

  public async exec(_: Message, args: any): Promise<Message> {
    await _.delete();
    const role: Role = this.client.heists.get(_.channel.id);
    if (!role) return;
    const { channel }: any = _;
    await channel.updateOverwrite(role.id, { SEND_MESSAGES: null });
    return _.channel.send({ embed: {
      title: `**LOCKED FOR \`${role.name}\`**`,
      color: 'GREEN',
      footer: {
        text: _.guild.name,
        iconURL: _.guild.iconURL({ dynamic: true })
      }
    }});
  }
}
