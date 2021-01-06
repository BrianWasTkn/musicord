import { LavaClient, LavaCommand, Command } from 'discord-akairo'
import { Message, Role, Snowflake } from 'discord.js'

export default class Util extends Command implements LavaCommand {
  public client: LavaClient;
  public constructor() {
    super('hunlock', {
      aliases: ['hunlock', 'hul'],
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
    const perms = { SEND_MESSAGES: true };
    const edit = (id: Snowflake, perms: any): any => {
      return channel.updateOverwrite(id, perms);
    }

    const chan: any = await edit(role.id, perms);
    return chan.send(`Unlocked for **${role.name}**`);
  }
}