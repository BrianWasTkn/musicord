import { 
  Message, Guild, GuildMember 
} from 'discord.js'
import { Command } from 'discord-akairo'

export default class Currency extends Command {
  public client: Akairo.Client;
  public constructor() {
    super('dev', {
      aliases: ['dev', 'g'],
      channel: 'guild',
      ownerOnly: true,
      category: 'Currency',
      cooldown: 1e3,
      args: [{ 
        id: 'option', 
        type: 'string' 
      }, {
        id: 'amount', 
        type: 'number'
      }, {
        id: 'user', 
        type: 'member'
      }]
    });
  }

  public async exec(_: Message, args: any): Promise<Message> {
    const { option, amount, user }: {
      option: string,
      amount: number,
      user: GuildMember
    } = args;

    if (['give', 'g', 'add'].includes(option)) {
      await this.client.db.currency.addPocket(user.user.id, amount);
      return _.channel.send(`Added **${amount.toLocaleString()}** to ${user.user.username}'s pocket.`);
    }
  }
}