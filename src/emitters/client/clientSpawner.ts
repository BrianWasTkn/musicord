import { Context } from '@lib/extensions/message';
import { Listener } from '@lib/handlers';
import { Lava } from '@lib/Lava';

export default class ClientListener extends Listener<Lava> {
  constructor() {
    super('spawner', {
      emitter: 'client',
      event: 'message',
    });
  }

  public async exec(message: Context) {
    const { config, handlers, ownerID, db } = this.client;

    if (!config.spawn.enabled) return;
    if (message.author.bot || message.channel.type === 'dm') return;

    const spawner = handlers.spawn.modules.random();
    const handler = handlers.spawn;

    if (ownerID === message.author.id) {
      if (message.content === 'lava spawn') {
        await message.delete();
        return await handler.spawn(spawner, message);
      }
    }

    const { unpaid } = await db.spawns.fetch(message.author.id);
    if (Math.round(Math.random() * 100) < 100 - spawner.config.odds) return;
    if (unpaid >= this.client.config.spawn.cap) return;

    const { cats, bl } = config.spawn;
    if (handler.cooldowns.has(message.author.id)) return;
    if (handler.queue.has(message.channel.id)) return;
    if (!cats.includes(message.channel.parentID)) return;
    if (bl.includes(message.channel.id)) return;

    return await handler.spawn(spawner, message);
  }
}
