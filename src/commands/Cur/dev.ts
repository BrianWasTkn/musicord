import { Message, MessageEmbed } from 'discord.js'
import { LavaClient, LavaCommand, Command } from 'discord-akairo'

export default class Currency extends Command implements LavaCommand {
  public client: LavaClient;
  public constructor() {
    super('dev', {
      aliases: ['dev', 'g'],
      channel: 'guild',
      ownerOnly: true,
      cooldown: 1e3,
      args: [{ 
        id: 'option', type: 'string' 
      }, {
        id: 'amount', type: 'number'
      }, {
        id: 'user', type: 'member'
      }]
    });
  }

  public async exec(_: Message, args: any): Promise<Message> {
    const { channel, guild } = _;
    const { 
      option = 'add', 
      amount = 1, 
      user = _.member 
    } = args;

    if (['give', 'g', 'add'].includes(option)) {
      await this.client.db.currency.addPocket(user.user.id, amount);
      return channel.send(`Added **${amount.toLocaleString()}** to ${user.username}'s pocket.`);
    }
  }
}