import { Message, MessageReaction } from 'discord.js';
import { SpawnHandler, Spawn } from '@lib/handlers/spawn';
import { Listener } from '@lib/handlers';
import { Lava } from '@lib/Lava';

export default class SpawnListener extends Listener {
  constructor() {
    super('messageCollect', {
      emitter: 'spawn',
      event: 'messageCollect',
    });
  }

  async exec(args: {
    msg: Message;
    spawner: Spawn;
    isFirst: boolean;
    handler: SpawnHandler<Spawn>;
  }): Promise<MessageReaction> {
    const { msg, spawner, isFirst, handler } = args;
    spawner.answered.set(msg.author.id, true);
    return msg.react(
      isFirst ? '<:memerGold:753138901169995797>' : spawner.spawn.emoji
    );
  }
}
