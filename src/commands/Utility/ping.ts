import { Message } from 'discord.js';
import { Command } from 'discord-akairo';

export default class Util extends Command {
  public client: Akairo.Client;

  constructor() {
    super('ping', {
      aliases: ['ping', 'pong'],
      channel: 'guild',
      description: 'Checks the average latency across all shards',
      category: 'Utility',
    });
  }

  async exec(_: Message): Promise<Message> {
    const { channel, guild } = _;
    const { ping } = guild.shard;

    return channel.send(`**Ponge:** ${ping}ms`);
  }
}
