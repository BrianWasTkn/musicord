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

  async exec(
    handler: SpawnHandler<Spawn>,
    spawner: Spawn,
    msg: Message,
    str: string
  ): Promise<Collection<string, SpawnQueue>> {
    const { emoji, type, title, description } = spawner.spawn;
    const embed = new Embed()
      .setFooter(
        false,
        `Spawned by: ${msg.author.tag}`,
        msg.author.avatarURL({ dynamic: true })
      )
      .setDescription(
        `**${emoji} \`${type} EVENT NICE!\`**\n**${title}**\n${description}`
      )
      .setColor('GOLD');

    const eventMessage = await msg.channel.send({ embed });
    await msg.channel.send(`Type \`${str.split('').join('\u200b')}\``);

    return handler.queue.set(msg.channel.id, {
      msg: eventMessage.id,
      spawn: spawner,
      channel: msg.channel.id,
    });
  }
}
