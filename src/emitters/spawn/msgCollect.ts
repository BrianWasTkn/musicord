import { Listener } from 'discord-akairo';
import { Message, MessageReaction } from 'discord.js';
import { SpawnHandler, Spawn } from '@lib/handlers/spawn';
import { Lava } from '@lib/Lava';

export default class SpawnListener extends Listener {
  client: Lava;

  constructor() {
    super('messageCollect', {
      emitter: 'spawn',
      event: 'messageCollect',
    });
  }

  async exec(
    handler: SpawnHandler<Spawn>,
    spawner: Spawn,
    msg: Message,
    isFirst: boolean
  ): Promise<MessageReaction> {
    spawner.answered.set(msg.author.id, true);
    return msg.react(isFirst ? '<:memerGold:753138901169995797>' : spawner.spawn.emoji);
  }
}
