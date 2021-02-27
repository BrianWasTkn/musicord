import { Listener } from 'discord-akairo';
import { Message, MessageReaction } from 'discord.js';
import { SpawnHandler, Spawn } from '@lib/handlers/spawn'
import { Lava } from '@lib/Lava'

export default class SpawnListener extends Listener {
  client: Lava;
  
  constructor() {
    super('spawn-messageCollect', {
      event: 'messageCollect',
      emitter: 'spawnHandler',
    });
  }

  async exec(
    handler: SpawnHandler,
    spawner: Spawn,
    msg: Message,
    isFirst: boolean
  ): Promise<MessageReaction> {
    spawner.answered.set(msg.author.id, msg.member.user);
    if (isFirst) return msg.react('<:memerGold:753138901169995797>');
    return msg.react(spawner.spawn.emoji);
  }
}
