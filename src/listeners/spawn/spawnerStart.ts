import { SpawnHandler, Spawn, Listener } from 'lib/objects';
import { TextChannel, Collection } from 'discord.js';
import { Context } from 'lib/extensions';
import { Lava } from 'lib/Lava';

export default class SpawnListener extends Listener<SpawnHandler<Spawn>> {
  constructor() {
    super('messageStart', {
      emitter: 'spawn',
      event: 'messageStart',
    });
  }

  async exec(args: {
    str: string;
    ctx: Context;
    spawner: Spawn;
    handler: SpawnHandler<Spawn>;
  }): Promise<Collection<string, Handlers.Spawn.Queue>> {
    const { str, ctx, spawner, handler } = args;
    const { randomInArray } = this.client.util;
    const { spawn } = spawner;

    const m = await ctx.send({
      content: `**${spawn.emoji} \`${spawn.type} EVENT NICE!\`**`,
      embed: {
        footer: {
          text: ctx.author.tag,
          iconURL: ctx.author.avatarURL({ dynamic: true }),
        },
        description: spawn.description,
        title: spawn.title,
        color: 'GOLD',
      },
    });

    const title = `Type \`${str.split('').join('\u200b')}\``;
    const color = randomInArray(['GOLD', 'GREEN', 'ORANGE']);
    await ctx.send({ embed: { title, color } });

    return handler.queue.set(ctx.channel.id, {
      channel: ctx.channel.id,
      spawn: spawner,
      msg: (m as Context).id,
    });
  }
}
