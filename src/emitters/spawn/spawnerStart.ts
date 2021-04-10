import { Message, TextChannel, Collection } from 'discord.js';
import { SpawnHandler, Spawn } from '@lib/handlers/spawn';
import { SpawnQueue } from '@lib/interface/handlers/spawn';
import { Listener } from '@lib/handlers';
import { Lava } from '@lib/Lava';

export default class SpawnListener extends Listener {
  constructor() {
    super('messageStart', {
      emitter: 'spawn',
      event: 'messageStart',
    });
  }

  async exec(args: {
    str: string;
    msg: Message;
    spawner: Spawn;
    handler: SpawnHandler<Spawn>;
  }): Promise<Collection<string, SpawnQueue>> {
    const { str, msg, spawner, handler } = args;
    const { randomInArray } = this.client.util;
    const { spawn } = spawner;

    const m = await msg.channel.send({
      content: `**${spawn.emoji} \`${spawn.type} EVENT NICE!\`**`,
      embed: {
        footer: { text: msg.author.tag, iconURL: msg.author.avatarURL({ dynamic: true }) },
        description: spawn.description,
        title: spawn.title,
        color: 'GOLD',
      }
    });

    const title = `Type \`${str.split('').join('\u200b')}\``;
    const color = randomInArray(['GOLD', 'GREEN', 'ORANGE']);
    await msg.channel.send({ embed: { title, color }});

    return handler.queue.set(msg.channel.id, {
      channel: msg.channel.id,
      spawn: spawner,
      msg: m.id,
    });
  }
}
