import { Message, Collection, TextChannel } from 'discord.js';
import { SpawnHandler, Spawn } from '@lib/handlers/spawn';
import { Listener } from 'discord-akairo';
import { Embed } from '@lib/utility/embed';
import { Lava } from '@lib/Lava';

export default class SpawnListener extends Listener {
  client: Lava;

  constructor() {
    super('messageResults', {
      emitter: 'spawn',
      event: 'messageResults',
    });
  }

  async exec(args: {
    msg: Message,
    spawner: Spawn,
    collected: Collection<string, Message>,
    handler: SpawnHandler<Spawn>,
    isEmpty: boolean,
  }): Promise<Message> {
    const { msg: message, spawner, collected, handler, isEmpty } = args;
    const queue = handler.queue.get(message.channel.id);
    const msg = await message.channel.messages.fetch(queue.msg);
    const emoji = '<:memerRed:729863510716317776>';
    handler.queue.delete(msg.channel.id);
    spawner.answered.clear();

    try {
      const embed = msg.embeds[0].setColor('BLACK');
      await msg.edit({ embed });
    } catch {}

    if (!isEmpty) {
      const embed = new Embed()
        .setDescription(`**${emoji} No one got it RIP**`)
        .setColor('RED');
      return msg.channel.send({ embed });
    }

    const results: string[] = [];
    const promises: Promise<void | Message>[] = [];
    const verbs = ['obtained', 'got', 'procured', 'won'];
    const verb = this.client.util.randomInArray(verbs);

    collected.array().forEach(async (msg: Message, i: number) => {
      const { fetch, add } = this.client.db.spawns;
      const { min, max, first } = spawner.config.rewards;
      let coins = this.client.util.randomNumber(min, max);
      if (Math.random() > 0.65 && i === 0) coins = first;
      const { spawn } = spawner;
      const { user } = msg.member;

      results.push(
        `\`${user.username}\` ${verb} **${coins.toLocaleString()}** coins`
      );
      await add(user.id, 'eventsJoined', 1);
      const db = await add(user.id, 'unpaid', coins);

      const embed = new Embed()
        .setFooter(
          true,
          message.guild.name,
          message.guild.iconURL({ dynamic: true })
        )
        .addField('• Coins Earned', coins.toLocaleString())
        .addField('• New Unpaids', db.unpaid.toLocaleString())
        .setTitle(`${spawn.emoji} ${spawn.title}`)
        .setColor('RANDOM');

      promises.push(user.send({ embed }).catch(() => {}));
    });

    await Promise.all(promises);
    const payouts = message.guild.channels.cache.get(
      '796688961899855893'
    ) as TextChannel;
    const embed = new Embed()
      .setFooter(false, 'Check DMs for info.')
      .setDescription(results.join('\n'))
      .setAuthor(spawner.spawn.title)
      .setColor('RANDOM');

    try {
      await msg.channel.send({ embed });
      embed.setFooter(false, msg.channel.id);
      try {
        await payouts.send({ embed });
      } catch {}
    } catch {}
  }
}
