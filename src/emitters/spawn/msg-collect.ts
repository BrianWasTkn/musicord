import { Listener } from 'discord-akairo';
import { Message, MessageReaction } from 'discord.js';

export default class SpawnListener extends Listener {
  public client: Akairo.Client;

  constructor() {
    super('spawn-messageCollect', {
      event: 'messageCollect',
      emitter: 'spawnHandler',
    });
  }

  async exec(
    handler: Akairo.SpawnHandler,
    spawner: Akairo.Spawn,
    msg: Message,
    isFirst: boolean
  ): Promise<MessageReaction> {
    spawner.answered.set(msg.author.id, msg.member.user);
    if (isFirst) return msg.react('<:memerGold:753138901169995797>');
    return msg.react(spawner.spawn.emoji);
  }
}
