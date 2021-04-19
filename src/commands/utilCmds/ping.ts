import { Context } from '@lib/extensions/message';
import { Command } from '@lib/handlers/command';

export default class Util extends Command {
  constructor() {
    super('ping', {
      aliases: ['ping', 'pong'],
      channel: 'guild',
      description: 'Checks the average latency across all shards',
      category: 'Utility',
    });
  }

  async exec(ctx: Context): Promise<string> {
    const { channel, guild } = ctx;
    const { ping } = guild.shard;

    return `**Ponge:** ${ping}ms`;
  }
}
