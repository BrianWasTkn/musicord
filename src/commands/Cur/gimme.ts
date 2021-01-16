import { Message, MessageEmbed } from 'discord.js'
import { LavaClient, Command } from 'discord-akairo'

export default class Currency extends Command {
  public client: LavaClient;
  public constructor() {
    super('gimme', {
      aliases: ['gimme'],
      channel: 'guild',
      cooldown: 5000,
    });
  }

  public async exec(_: Message, args: any): Promise<Message> {
    const user = _.member;
    const amount = this.client.util.random('num', [100, 500]) * 1000;
    const data = await this.client.db.currency.addPocket(user.user.id, amount);
    return _.channel.send(`Successfully added **${amount.toLocaleString()}** coins to your pocket.`);
  }
}