import { Message } from 'discord.js';
import { Command } from 'discord-akairo';
import { Lava } from '@lib/Lava';

export default class Util extends Command {
  client: Lava;

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
