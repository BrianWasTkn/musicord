import { LavaClient, Command } from 'discord-akairo'
import { Message, Snowflake, Role } from 'discord.js'

export default class Util extends Command {
  public client: LavaClient;
  public constructor() {
    super('hunock', {
      aliases: ['hunlock', 'hul'],
      channel: 'guild',
      userPermissions: ['MANAGE_MESSAGES'],
      args: [ 
        { id: 'query', type: 'string' } 
      ]
    });
  }

  public async exec(_: Message, args: any): Promise<Message> {
    await _.delete();
    const { query }: { query: string } = args;
    const { channel }: { channel: any } = _;
    const target = this.client.config.heist.amari[query] || this.client.config.heist.mastery[query];
    const role: Role = _.guild.roles.cache.get(target);
    if (!role) return;

    const perms: { [k: string]: boolean | null } = { SEND_MESSAGES: true };
    const updated: any = await channel.updateOverwrite(role.id, perms);
    return channel.send(`Unlocked for **${role.name}**`);
  }
}
