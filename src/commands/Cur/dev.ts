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
      user = _.member.user 
    } = args;

    if (['give', 'g', 'add'].includes(option)) {
      let data = await this.client.db.currency.fetch({ userID: user.id });
      data = await this.client.db.currency.add({ userID: user.id, amount, type: 'pocket' });
      return channel.send(`Added **${amount.toLocaleString()}** to ${user.username}'s pocket.`);
    }
  }
}