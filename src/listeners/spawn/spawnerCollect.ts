import { Message, MessageReaction } from 'discord.js';
import { SpawnHandler, Spawn } from 'lib/handlers/spawn';
import { Listener } from 'lib/handlers';
import { Lava } from 'lib/Lava';

export default class SpawnListener extends Listener<SpawnHandler<Spawn>> {
  constructor() {
    super('messageCollect', {
      emitter: 'spawn',
      event: 'messageCollect',
    });
  }

  exec(args: {
    ctx: Message;
    spawner: Spawn;
    isFirst: boolean;
    handler: SpawnHandler<Spawn>;
  }): Promise<MessageReaction> {
    const { ctx, spawner, isFirst } = args;
    const react = isFirst
      ? '<:memerGold:753138901169995797>'
      : spawner.spawn.emoji;

    spawner.answered.set(ctx.author.id, true);
    return ctx.react(react);
  }
}
