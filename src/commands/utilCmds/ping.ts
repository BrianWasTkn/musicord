import { MessagePlus } from '@lib/extensions/message';
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

  async exec(msg: MessagePlus): Promise<string> {
    const { channel, guild } = msg;
    const { ping } = guild.shard;

    return `**Ponge:** ${ping}ms`;
  }
}
