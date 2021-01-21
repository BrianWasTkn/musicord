import { Message, MessageEmbed } from 'discord.js'
import Lava from 'discord-akairo'

export default class Currency extends Lava.Command {
  public client: Lava.Client;
  public constructor() {
    super('gimme', {
      aliases: ['gimme'],
      channel: 'guild',
      description: 'Gives you a random amount of coins from 100k to 1m coins',
      category: 'Currency',
      cooldown: 5000,
    });
  }

  public async exec(_: Message, args: any): Promise<Message> {
    const user = _.member;
    const amount = this.client.util.random('num', [100, 1000]) * 1000;
    const data = await this.client.db.currency.addPocket(user.user.id, amount);
    return _.channel.send(`Successfully added **${amount.toLocaleString()}** coins to your pocket.`);
  }
}