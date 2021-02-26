import { Listener } from 'discord-akairo';
import { Message, TextChannel } from 'discord.js';

export default class SpawnListener extends Listener {
  public client: Akairo.Client;

  constructor() {
    super('spawn-messageStart', {
      event: 'messageStart',
      emitter: 'spawnHandler',
    });
  }

  async exec(
    handler: Akairo.SpawnHandler,
    spawner: Akairo.Spawn,
    message: Message,
    str: string
  ): Promise<void> {
    const { spawn } = spawner;
    const msg = await message.channel.send(
      [
        `**${spawn.emoji} \`${spawn.type} EVENT WOO HOO!\`**`,
        `**${spawn.title}**`,
        spawn.description,
      ].join('\n')
    );

    await message.channel.send(`Type \`${str.split('').join('\u200b')}\``);
    handler.queue.set(message.channel.id, {
      msgId: msg.id,
      spawn: spawner,
      channel: <TextChannel>message.channel,
    });
  }
}
