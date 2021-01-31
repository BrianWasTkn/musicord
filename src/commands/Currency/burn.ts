import { Message, MessageEmbed } from 'discord.js'
import Lava from 'discord-akairo'

export default class Currency extends Lava.Command {
  public client: Lava.Client;
  public constructor() {
    super('burn', {
      aliases: ['burn'],
      channel: 'guild',
      description: 'Burn a certain amount of coins if you\'re already max',
      category: 'Currency',
      cooldown: 10e3,
      args: [{
        id: 'amount', 
        type: 'number'
      }]
    });
  }

  public async exec(_: Message, { amount }: any): Promise<Message> {
    const db = await this.client.db.currency.fetch(_.author.id);

    if (!amount) {
      return _.channel.send('You need something to burn, bruh');
    };

    if (amount < 1) {
      return _.channel.send('You thought you can exploit me huh?');
    }

    if (amount >= db.pocket) {
      return _.channel.send('You ain\'t allowed to burn higher than your pocket lmao');
    }

    const data = await this.client.db.currency.removePocket(_.author.id, amount);
    return _.channel.send(`Successfully burned **${amount.toLocaleString()}** coins from your pocket.`);
  }
}