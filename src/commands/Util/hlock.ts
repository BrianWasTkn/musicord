import { Message, MessageEmbed, Role, Snowflake } from 'discord.js'
import { LavaClient, LavaCommand, Command } from 'discord-akairo'
import { 
  MASTERY_ROLES as M_ROLES,
  AMARI_ROLES as A_ROLES
} from '../../config'

export default class Util extends Command implements LavaCommand {
  public client: LavaClient;
  public constructor() {
    super('hlock', {
      aliases: ['hlock', 'hl'],
      channel: 'guild',
      args: [ 
        { id: 'type', type: 'string' } 
      ]
    });
  }

  public async exec(_: Message, args: any): Promise<Message> {
    const { type }: { type: string } = args;
    const { channel }: any = _;
    const perms = { SEND_MESSAGES: false };
    const edit = (id: Snowflake, perms: any): any => {
      return channel.updateOverwrite(id, perms);
    }

    let role;
    if (type.match(/(m)(\d+)/gi)) {
      role = await this.fetchMasteryRole(_, type);
      role = await edit(role.id, perms);
      return channel.send(`Locked for **${role.name}**`);
    } else if (type.match(/(l)(\d+)/gi)) {
      role = await this.fetchAmariRole(_, type);
      role = await edit(role.id, perms);
      return channel.send(`Locked for **${role.name}**`);
    } else {
      return;
    }
  }

  protected async fetchMasteryRole(_: Message, type: string): Promise<Role> {
    type = type.split('')[1];
    return M_ROLES
    .map(r => _.guild.roles.cache.get(r))
    .find(r => r.name.includes(type));
  }

  protected async fetchAmariRole(_: Message, type: string): Promise<Role> {
    type = type.split('')[1];
    return A_ROLES
    .map(r => _.guild.roles.cache.get(r))
    .find(r => r.name.includes(type));
  }

}