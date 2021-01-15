import { Message, MessageEmbed } from 'discord.js'
import { LavaClient, LavaCommand, Command } from 'discord-akairo'

export default class Currency extends Command implements LavaCommand {
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
    const data = await this.client.db.currency
      .removePocket(_.author.id, amount);
    return _.channel.send(`Successfully burned **${amount.toLocaleString}** coins from your pocket.`);
  }
}