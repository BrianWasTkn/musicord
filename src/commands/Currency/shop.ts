import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class Currency extends Command {
  public client: Akairo.Client;

  constructor() {
    super('shop', {
      aliases: ['shop', 'item'],
      channel: 'guild',
      description: 'View or buy something from the shop.',
      category: 'Currency',
      cooldown: 1000,
    });
  }

  async exec(msg: Message): Promise<Message> {
    return msg.channel.send('Soon:tm:');
  }
}
