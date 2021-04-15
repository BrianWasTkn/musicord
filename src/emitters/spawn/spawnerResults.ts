import { Collection, TextChannel } from 'discord.js';
import { SpawnHandler, Spawn } from '@lib/handlers/spawn';
import { MessagePlus } from '@lib/extensions/message';
import { Listener } from '@lib/handlers';
import { Embed } from '@lib/utility/embed';

export default class SpawnListener extends Listener {
  constructor() {
    super('messageResults', {
      emitter: 'spawn',
      event: 'messageResults',
    });
  }

  async exec(args: {
    msg: MessagePlus;
    spawner: Spawn;
    collected: Collection<string, MessagePlus>;
    handler: SpawnHandler<Spawn>;
    isEmpty: boolean;
  }): Promise<MessagePlus> {
    const { msg: message, spawner, collected, handler, isEmpty } = args;
    const { randomInArray, randomNumber } = this.client.util;
    const queue = handler.queue.get(message.channel.id);
    const msg = message.channel.messages.cache.get(queue.msg);
    const emoji = '<:memerRed:729863510716317776>';
    handler.queue.delete(msg.channel.id);
    spawner.answered.clear();

    msg.edit({ embed: msg.embeds[0].setColor('BLACK') }).catch(() => {}); // im not racist >:(

    if (!isEmpty) {
      const description = `**${emoji} No one got it RIP**`;
      const color = 'RED';

      return msg.channel.send({ 
        embed: { color, description }
      }) as Promise<MessagePlus>;
    }

    const promises: Promise<void | MessagePlus>[] = [];
    const results: string[] = [];
    const verbs = ['obtained', 'got', 'procured', 'won'];
    const verb = randomInArray(verbs);

    collected.array().forEach(async (msg: MessagePlus, i: number) => {
      const { min, max, first } = spawner.config.rewards;
      const { fetch } = this.client.db.spawns;
      const { spawn } = spawner;
      const { user } = msg.member;
      const oddHit = Math.random() > 0.99 && i === 0;
      const coins = oddHit ? first : randomNumber(min / 1e3, max / 1e3) * 1e3;

      const result = `+ ${user.username} ${verb} ${coins.toLocaleString()}`;
      results.push(result);
      const data = await fetch(user.id);
      data.eventsJoined++;
      data.unpaid += coins;
      const db = await data.save();

      if (db.allowDM) {
        const fields = {
          '• Coins Earned': coins.toLocaleString(),
          '• New Unpaids': db.unpaid.toLocaleString()
        };

        promises.push(user.send({ embed: {
          footer: { text: msg.guild.name, iconURL: msg.guild.iconURL({ dynamic: true }) },
          fields: Object.entries(fields).map(([name, value]) => ({ name, value })),
          title: `${spawn.emoji} ${spawn.title}`,
          color: 'RANDOM',
        }}).catch(() => {}) as Promise<void | MessagePlus>);
      }
    });

    if (promises.length >= 1) await Promise.all(promises);
    const channels = message.guild.channels.cache;
    const payouts = channels.get('796688961899855893') as TextChannel;
    const embed = new Embed()
      .setDescription('```diff\n' + results.join('\n') + '```')
      .setFooter(false, 'Check DMs for info.')
      .setAuthor(spawner.spawn.title)
      .setColor('RANDOM');

    msg.channel.send({ embed }).catch(() => {});
    embed.setFooter(false, msg.channel.id);
    payouts.send({ embed }).catch(() => {});
  }
}
