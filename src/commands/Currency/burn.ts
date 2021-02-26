import { Message } from 'discord.js';
import { Command } from 'discord-akairo';

export default class Currency extends Command {
  public client: Akairo.Client;

  constructor() {
    super('burn', {
      aliases: ['burn'],
      channel: 'guild',
      description: "Burn a certain amount of coins if you're already max",
      category: 'Currency',
      cooldown: 10e3,
      args: [
        {
          id: 'amount',
          type: 'number',
        },
      ],
    });
  }

  async exec(_: Message, { amount }: any): Promise<Message> {
    const db = await this.client.db.currency.fetch(_.author.id);

    if (!amount) return _.channel.send('You need something to burn, bruh');
    else if (amount < 1)
      return _.channel.send('You thought you can exploit me huh?');
    else if (amount >= db.pocket)
      return _.channel.send(
        "You ain't allowed to burn higher than your pocket lmao"
      );

    await this.client.db.currency.removePocket(_.author.id, amount);
    return _.channel.send(
      `Successfully burned **${amount.toLocaleString()}** coins from your pocket.`
    );
  }
}
