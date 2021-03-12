import { Command } from '@lib/handlers/command';
import { Message } from 'discord.js';

export default class Util extends Command {
  constructor() {
    super('ping', {
      aliases: ['ping', 'pong'],
      channel: 'guild',
      description: 'Checks the average latency across all shards',
      category: 'Utility',
    });
  }

  async exec(_: Message): Promise<string> {
    const { channel, guild } = _;
    const { ping } = guild.shard;

    return `**Ponge:** ${ping}ms`;
  }
}
