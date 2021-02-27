import { Listener } from 'discord-akairo';
import { Message } from 'discord.js';
import { Spawn } from '@lib/handlers/spawn';
import { Lava } from '@lib/Lava';

export default class DiscordListener extends Listener {
  client: Lava;

  public constructor() {
    super('spawner', {
      emitter: 'client',
      event: 'message',
    });
  }

  public async exec(message: Message): Promise<Message> {
    if (!this.client.config.spawn.enabled) return;
    if (message.author.bot || message.channel.type === 'dm') return;

    const spawner: Spawn = this.client.handlers.spawn.modules.random();
    const { unpaid } = await this.client.db.spawns.fetch(message.author.id);
    if (Math.round(Math.random() * 100) < 100 - spawner.config.odds) return;
    if (unpaid >= 10000000) return;

    const handler = this.client.handlers.spawn;
    const { cats, bl } = this.client.config.spawn;
    if (handler.cooldowns.has(message.author.id)) return;
    if (handler.queue.has(message.channel.id)) return;
    if (bl.includes(message.channel.id)) return;
    if (!cats.includes(message.channel.parentID)) return;

    await handler.spawn(spawner, message);
  }
}
