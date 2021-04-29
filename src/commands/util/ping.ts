import { Context } from 'lib/extensions/message';
import { Command } from 'lib/handlers/command';

export default class Util extends Command {
  constructor() {
    super('ping', {
      aliases: ['ping', 'pong'],
      channel: 'guild',
      description: 'Checks the average latency across all shards',
      category: 'Utility',
    });
  }

  exec(ctx: Context): string {
    return `**Ponge:** ${ctx.guild.shard.ping}ms`;
  }
}
