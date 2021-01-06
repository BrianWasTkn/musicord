import { LavaClient, LavaCommand, Command } from 'discord-akairo'
import { Message, Role, Snowflake } from 'discord.js'

export default class Util extends Command implements LavaCommand {
  public client: LavaClient;
  public constructor() {
    super('hlock', {
      aliases: ['hlock', 'hl'],
      channel: 'guild',
      userPermissions: 'MANAGE_CHANNELS',
      args: [ 
        { id: 'role', type: 'role' } 
      ]
    });
  }

  public async exec(_: Message, args: any): Promise<Message> {
    const { role }: { role: Role } = args;
    const { channel }: any = _;
    const perms = { SEND_MESSAGES: null };
    const edit = (id: Snowflake, perms: any): any => {
      return channel.updateOverwrite(id, perms);
    }

    const chan: any = await edit(role.id, perms);
    return chan.send(`Locked for **${role.name}**`);
  }
}