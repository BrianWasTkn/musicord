import { Message, TextChannel, Collection } from 'discord.js';
import { SpawnHandler, Spawn } from '@lib/handlers/spawn';
import { SpawnQueue } from '@lib/interface/handlers/spawn';
import { Listener } from 'discord-akairo';
import { Embed } from '@lib/utility/embed';
import { Lava } from '@lib/Lava';

export default class SpawnListener extends Listener {
  client: Lava;

  constructor() {
    super('messageStart', {
      emitter: 'spawn',
      event: 'messageStart',
    });
  }

  async exec(args: {
    str: string,
    msg: Message,
    spawner: Spawn,
    handler: SpawnHandler<Spawn>
  }): Promise<Collection<string, SpawnQueue>> {
    const { str, msg, spawner, handler } = args;
    const { emoji, type, title, description } = spawner.spawn;
    const content = `**${emoji} \`${type} EVENT NICE!\`**`;
    const embed = new Embed()
      .setFooter(false, msg.author.tag, msg.author.avatarURL({ dynamic: true }))
      .setDescription(description)
      .setTitle(title)
      .setColor('GOLD');

    const eventMessage = await msg.channel.send({ content, embed });
    await msg.channel.send({ embed: { 
      title: `Type \`${str.split('').join('\u200b')}\``,
      color: 'GOLD',
    }});

    return handler.queue.set(msg.channel.id, {
      msg: eventMessage.id,
      spawn: spawner,
      channel: msg.channel.id,
    });
  }
}
