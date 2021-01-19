import { Message, MessageEmbed } from 'discord.js'
import { LavaClient, Command } from 'discord-akairo'

export default class Currency extends Command {
  public client: LavaClient;
  public constructor() {
    super('burn', {
      aliases: ['burn'],
      channel: 'guild',
      cooldown: 10e3,
      args: [{
        id: 'amount', type: 'number'
      }]
    });
  }

  public async exec(_: Message, args: any): Promise<Message> {
    const { amount } = args;
    if (!amount) return;
    if (amount < 1) return _.reply('You thought you can exploit me huh?');
    const data = await this.client.db.currency.removePocket(_.author.id, amount);
    return _.channel.send(`Successfully burned **${amount.toLocaleString()}** coins from your pocket.`);
  }
}